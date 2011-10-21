// cfSlider의 작동 방식은
// 아이템들을 감싸고 있는 container의 margin-left 값을 조절해서
// margin-left를 작게하면 아이템들이 왼쪽으로 움직이고, margin-left를 크게하면 아이템들이 오른쪽으로 움직이는 원리를 사용합니다.
// margin-left 값을 조절할 때 jQuery의 animate 메서드를 사용해서 container가 슬라이딩하는 것처럼 보이게 합니다.
// 그리고 위 방식의 경우 현재 첫 번째 아이템을 보고 있는데 margin-left를 크게하거나, 마지막 아이템을 보고 있는데 margin-left를 작게하면
// 보여줄 아이템이 없게 되는 현상이 발생하므로, html코드에 있는 원본 아이템 목록 중 뒤쪽과 앞쪽에 있는 아이템들을 복사하여
// 원본 아이템 목록의 앞과 뒤에 붙여넣어서 새로운 아이템 목록을 만드는 방법을 사용합니다. 이때 앞뒤에 복사해서 붙여넣는 아이템의 각 개수는
// 화면에 보여질 아이템의 수와 같게 해줍니다.(options에서 visible 항목입니다.)

;(function($) {
	
	$.fn.cfSlider = function(options) {
		
		var defaults = {
			container: '.container',	// 아이템들을 가지고 있는 엘리먼트의 jQuery 셀렉터
			item: '.item',				// 아이템 엘리먼트의 jQuery 셀렉터
			visible: 1,					// 한 화면에 보여질 아이템의 수
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
				$afterItems = $items.slice(0, options.visible).clone(),		// 아이템들 중에서 앞에서 부터 visible 수 만큼 복사
				$beforeItems = $items.slice(itemLength - options.visible, itemLength).clone(),	// 아이템들 중에서 뒤에서 부터 visible 수 만큼 복사
				itemWidth = $items.first().width(),		// 아이템 하나의 너비를 구함
				$prevBtn = $(options.prevBtn),
				$nextBtn = $(options.nextBtn);
			
			$container.prepend($beforeItems).append($afterItems);	// 기존 아이템들의 앞에는 beforeItems를 추가하고 뒤에는 afterItems를 추가함
																	// 즉, 원래 아이템 목록이 '1-가','2-나','3-다','4-라','5-마' 이고 visible이 3이라면 아래와 같이됨
																	// ==> '1-다','2-라','3-마','4-가','5-나','6-다','7-라','8-마','9-가','10-나','11-다'
																	// 좌우 이동을 위해서 원래 html코드에 있던 아이템 목록의 앞뒤에 복사(clone)한 아이템들을 더 붙여 주는 것
																	 
			$container.css({
				width: itemWidth * (itemLength + options.visible * 2),	// 그리고 나서 $container의 width를 새로 복사해넣은 아이템들까지 포함한 width로 만들어주고
				marginLeft: -(itemWidth * options.visible)				// 원래 html코드에 있던 첫 번째 아이템이 보이게 하기위해 $container의 marginLeft 값을 조정함
			});															// 예) itemLength = 5, itemWidth = 100, visible = 3 인 상황이었다면
																		// 		$container의 width는 앞에 3개, 원래 5개, 뒤에 3개 이렇게 11개의 아이템이라 1100이 되고
																		//		원래 5개 중 첫 번째가 제일 처음에 보이게 하기위해 앞에 3개 width 만큼을 -marginLeft 처리함
			
			// 이전 버튼에 이벤트 발생시 실행
			$prevBtn.bind(options.eventType, function() {
				
				if ($container.is(':not(:animated)')) {					// 애니메이션 진행중일 때 누르면 반응 없도록 처리
					var marginLeft = $container.css('marginLeft');		// $container의 현재의 marginLeft 값을 가져옴
					
					$container.animate({
						marginLeft: parseInt(marginLeft) + itemWidth	// 이전으로 이동할 때에는 marginLeft 값을 현재보다 아이템 하나의 너비만큼 더해줍니다.
					}, options.speed, function() {						// 애니메이션의 콜백함수는 다음과 같은 기능을 합니다.
																		// container의 marginLeft 값이 계속 커져서 원래 아이템에서 복사한 아이템이 보이게된 후 ('4-가'에서 '3-마'로 바뀐 직후)
																		// marginLeft 값을 itemLength * itemWidth 만큼 빼줘서 현재 화면에 보인 '마'가 '3-마'가 아니라 '8-마'가 되게 해줍니다.
																		// 이렇게 처리하지 않고 이전 버튼을 계속 클릭하면 marginLeft값이 계속 커져서 아이템이 안보이게 되겠지만
																		// 이렇게 처리를 하면 marginLeft 값이 작아지게 되므로 다시 이전 버튼을 클릭해서 marginLeft를 더해도 슬라이딩이 가능하게 됩니다.
																		// marginLeft의 변화가 매우 빨리(즉시) 일어나고, 화면에는 계속 '마'가 보이기 때문에 사용자는 marginLeft의 변화를 인지하지 못합니다.
						if (parseInt($container.css('marginLeft')) == -(itemWidth * (options.visible - 1))) {
							$container.css('marginLeft', -(itemWidth * (itemLength + options.visible - 1)));
						}
					});
				}
				
			});
			
			// 다음 버튼에 이벤트 발생시 실행
			$nextBtn.bind(options.eventType, function() {
				
				if ($container.is(':not(:animated)')) {					// 애니메이션 진행중일 때 누르면 반응 없도록 처리
					var marginLeft = $container.css('marginLeft');		// $container의 현재의 marginLeft 값을 가져옴
					
					$container.animate({
						marginLeft: parseInt(marginLeft) - itemWidth	// 다음으로 이동할 때에는 marginLeft 값을 현재보다 아이템 하나의 너비만큼 빼줍니다.
					}, options.speed, function() {						// 애니메이션의 콜백함수는 다음과 같은 기능을 합니다.
																		// container의 marginLeft 값이 계속 작아져서 원래 아이템에서 복사한 아이템이 보이게된 후 ('8-마'에서 '9-가'로 바뀐 직후)
																		// marginLeft 값을 itemLength * itemWidth 만큼 더해줘서 현재 화면에 보인 '가'가 '9-가'가 아니라 '4-가'가 되게 해줍니다.
																		// 이렇게 처리하지 않고 다음 버튼을 계속 클릭하면 marginLeft값이 계속 작아져서 아이템이 안보이게 되겠지만
																		// 이렇게 처리를 하면 marginLeft 값이 커지게 되므로 다시 다음 버튼을 클릭해서 marginLeft를 빼도 슬라이딩이 가능하게 됩니다.
																		// marginLeft의 변화가 매우 빨리(즉시) 일어나고, 화면에는 계속 '가'가 보이기 때문에 사용자는 marginLeft의 변화를 인지하지 못합니다.
						if (parseInt($container.css('marginLeft')) == -(itemWidth * (itemLength + options.visible))) {
							$container.css('marginLeft', -(itemWidth * options.visible));
						}
					});
				}
				
			});
			
		});
		
		return this;
		
	};
	
})(jQuery);