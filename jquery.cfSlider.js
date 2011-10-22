/*
 * 안녕하세요 코드팩토리입니다. http://codefactory.kr, master@codefactory.kr
 * 이 프로그램은 아무런 제약없이 복사/수정/재배포 하셔도 되며 이 주석을 지우셔도 됩니다.
 * 감사합니다.
 */

// cfSlider의 작동 방식을 direction이 horizontal인 경우에 대해 설명드리면(가로 슬라이드, direction이 vertical이면 세로 슬라이드)
// 아이템들을 감싸고 있는 container의 margin-left 값을 조절해서
// margin-left를 작게하면 아이템들이 왼쪽으로 움직이고, margin-left를 크게하면 아이템들이 오른쪽으로 움직이는 원리를 사용합니다.
// margin-left 값을 조절할 때 jQuery의 animate 메서드를 사용해서 container가 슬라이딩하는 것처럼 보이게 합니다.
// 그리고 위 방식의 경우 현재 첫 번째 아이템을 보고 있는데 margin-left를 크게하거나, 마지막 아이템을 보고 있는데 margin-left를 작게하면
// 보여줄 아이템이 없게 되는 현상이 발생하므로, html코드에 있는 원본 아이템 목록 중 뒤쪽과 앞쪽에 있는 아이템들을 복사하여
// 원본 아이템 목록의 앞과 뒤에 붙여넣어서 새로운 아이템 목록을 만드는 방법을 사용합니다. 이때 앞뒤에 복사해서 붙여넣는 아이템의 각 개수는
// 화면에 보여질 아이템의 수와 같게 해줍니다.(options에서 display 항목입니다.)

;(function($) {
	
	$.fn.cfSlider = function(options) {
		
		var defaults = {
			container: '.container',	// 아이템들을 가지고 있는 엘리먼트의 jQuery 셀렉터
			item: '.item',				// 아이템 엘리먼트의 jQuery 셀렉터
			display: 1,					// 화면에 보여지는 아이템의 수
			move: 1,					// 한 번에 슬라이드될(이동할) 아이템의 수
			direction: 'horizontal',	// 가로슬라이드: horizontal, 세로슬라이드: vertical
			speed: 400,					// 슬라이딩 속도, 밀리세컨드 단위의 숫자 또는 jQuery.animate()에 사용가능한 'slow', 'fast' 등 문자열
			prevBtn: '.prev',			// 이전 버튼의 jQuery 셀렉터(꼭 버튼 형태일 필요 없음)
			nextBtn: '.next',			// 다음 버튼의 jQuery 셀렉터(꼭 버튼 형태일 필요 없음)
			eventType: 'click'			// slider를 작동시킬 때 필요한 이벤트. 즉, 이전/다음 버튼에 이 이벤트가 발생하면 slider 작동
										// 활용예) 모바일웹 개발할 때 터치(플리킹)으로 slider를 작동시키고 싶으면 이 자리에 click 대신 적절한
										// 커스텀 이벤트 타입을 등록하고, 터치를 할 때 그 커스텀 이벤트를 prevBtn, nextBtn에 발생시키면 됨
		};
		
		options = $.extend({}, defaults, options);
		
		return this.each(function() {
			
			var slider = $(this),
				$container = slider.find(options.container),
				$items = $container.find(options.item),
				itemLength = $items.length,
				$afterItems = $items.slice(0, options.display).clone(),		// 아이템들 중에서 앞에서 부터 options.display 만큼 복사
				$beforeItems = $items.slice(itemLength - options.display, itemLength).clone(),	// 아이템들 중에서 뒤에서 부터 options.display 만큼 복사
				itemSize = options.direction === 'horizontal' ? $items.first().width() : $items.first().height(),		// 아이템 하나의 너비 또는 높이를 구함
				marginType = options.direction === 'horizontal' ? 'marginLeft' : 'marginTop',	// 슬라이딩 효과에 사용할 margin의 종류
				$prevBtn = $(options.prevBtn),
				$nextBtn = $(options.nextBtn);
				
			slider.css('overflow', 'hidden');	// 필수 css 속성, css쪽에서 정의안하는 경우를 대비해 설정, 실제 움직이는 $container를 싸고 있는 slider가 overflow:hidden 속성을 가지고 있어야 자신의 크기만큼만 사용자에게 보여줄수 있기 때문
			
			$container.prepend($beforeItems).append($afterItems);	// 기존 아이템들의 앞에는 beforeItems를 추가하고 뒤에는 afterItems를 추가함
																	// 즉, 원래 아이템 목록이 '1-가','2-나','3-다','4-라','5-마' 이고 move가 3이라면 아래와 같이됨
																	// ==> '1-다','2-라','3-마','4-가','5-나','6-다','7-라','8-마','9-가','10-나','11-다'
																	// 좌우 이동을 위해서 원래 html코드에 있던 아이템 목록의 앞뒤에 복사(clone)한 아이템들을 더 붙여 주는 것
			
			
			// 그리고 나서 $container의 width를 새로 복사해넣은 아이템들까지 포함한 width로 만들어주고
			// 원래 html코드에 있던 첫 번째 아이템이 보이게 하기위해 $container의 marginLeft 값을 조정함
			// 예) itemLength = 5, itemSize = 100, move = 3 인 상황이었다면
			// 		$container의 width는 앞에 3개, 원래 5개, 뒤에 3개 이렇게 11개의 아이템이라 1100이 되고
			//		원래 5개 중 첫 번째가 제일 처음에 보이게 하기위해 앞에 3개 width 만큼을 -marginLeft 처리함
			// * 위 설명은 direction이 horizontal일 경우에 해당합니다. vertical일 경우에는 $container의 width는 itemSize이고 marginLeft대신 marginTop을 사용합니다.
			var containerCss = {};
			containerCss['width'] = options.direction === 'horizontal' ? itemSize * (itemLength + options.display * 2) : itemSize;
			containerCss[marginType] = -(itemSize * options.display);
			
			$container.css(containerCss);
			
			
			// 이전 버튼에 이벤트 발생시 실행
			$prevBtn.bind(options.eventType, function() {
				go('prev');
			});
		
			// 다음 버튼에 이벤트 발생시 실행
			$nextBtn.bind(options.eventType, function() {
				go('next');
			});
			
			// 슬라이드 함수
			function go(direction) {
				
				if ($container.is(':animated')) {		// 애니메이션 진행중일 때 누르면 반응 없도록 처리
					return;
				}
				
				var obj = {},	// animate에 넘길 parameter를 만들기 위한 임시 객체
					currentMargin = parseInt($container.css(marginType));	// $container의 현재 margin
				
				if (direction === 'prev') {
					
					var targetMargin = currentMargin + itemSize * options.move;		// 이동할 margin
						
					if ((Math.abs(currentMargin) / itemSize) < options.move) {	// 이전 위치에 아이템이 move할 아이템보다 적게 남아있을 경우
						$container.css(marginType, currentMargin - (itemSize * itemLength));	// itemSize * itemLength 만큼 margin을 조정 -> 이렇게 하기 위해 아이템들을 clone()해서 원본의 앞뒤에 붙여놨던 것 -> 순간적으로 margin이 조정되고 보이는 아이템 항목은 같기 때문에 사용자는 인지하지 못함
						targetMargin = targetMargin - (itemSize * itemLength);	// 이동할 margin 재설정
					}
					
				} else if (direction === 'next') {
					
					var targetMargin = currentMargin - itemSize * options.move;		// 이동할 margin
						
					if (itemLength + options.display * 2 - (Math.abs(currentMargin) / itemSize + options.display) < options.move) {	// 다음 위치에 아이템이 move할 아이템보다 적게 남아있을 경우
						$container.css(marginType, currentMargin + (itemSize * itemLength));	// itemSize * itemLength 만큼 margin을 조정 -> 이렇게 하기 위해 아이템들을 clone()해서 원본의 앞뒤에 붙여놨던 것 -> 순간적으로 margin이 조정되고 보이는 아이템 항목은 같기 때문에 사용자는 인지하지 못함
						targetMargin = targetMargin + (itemSize * itemLength);	// 이동할 margin 재설정
					}
					
				}
				
				obj[marginType] = targetMargin;
				$container.animate(obj, options.speed);		// 슬라이드 실행
				
			}
			
		});
		
		return this;
		
	};
	
})(jQuery);