안녕하세요 코드팩토리입니다. http://codefactory.kr, [프로그램 개발문의] master@codefactory.kr

이 프로그램은 아무런 제약없이 복사/수정/재배포 하셔도 되며 주석을 지우셔도 됩니다.
감사합니다.

## 소개
jQuery를 사용한 슬라이더 만들기 plugin 입니다.

[데모보기] http://codefactory.kr/demos/cfslider
[데모보기2] http://codefactory.kr/demos/cfslider/auto_slide.html - 3초에 한번씩 auto slide


## 사용방법
다음과 같은 형태의 HTML 마크업이 필요합니다. 꼭, ul,li가 사용될 필요는 없으며
slider > container > item 형태의 중첩구조이면 됩니다.

```html
<div id="slider">
	<ul class="container">
		<li class="item"></li>
		<li class="item"></li>
		<li class="item"></li>
		<li class="item"></li>
		<li class="item"></li>
	</ul>
</div>
```


CSS 스타일은 아래와 같이 합니다. 아래 예시의 경우는 화면에 하나의 item만 보여줄 경우이며
가로 슬라이드이면서 화면에 두 개의 item을 보여준다면, cfSlider를 생성할 때 display를 2로
설정하고 #slider의 width를 400px로 하면 됩니다.
.item의 width와 height는 슬라이드할 item 하나의 width와 height로 설정합니다.

``` html
<style>
	#slider {
		width: 200px;
		height: 70px;
		overflow: hidden;
	}
	
	#slider .container {
		list-style: none;
	}
	
	#slider .item {
		width: 200px;
		height: 70px;
		float: left;
	}
</style>
```


cfSlder의 사용은 아래와 같이 합니다. 옵션으로 화면에 보여질 item의 수(display, 기본값 1),
한 번에 슬라이드될 아이템의 수(move, 기본값 1), 속도(speed, 기본값 400) 등을 설정할 수 있습니다.

```html
<script>
	$('#slider').cfSlider();
</script>
```


## 옵션들
cfSlider의 적용가능 옵션은 아래와 같습니다.

```js
$('#slider').cfSlider({
	container: '.container',// 아이템들을 가지고 있는 엘리먼트의 jQuery 셀렉터
	item: '.item',		// 아이템 엘리먼트의 jQuery 셀렉터
	display: 1,		// 화면에 보여지는 아이템의 수
	move: 1,		// 한 번에 슬라이드될(이동할) 아이템의 수
	direction: 'horizontal',// 가로슬라이드: horizontal, 세로슬라이드: vertical
	speed: 400,		// 슬라이딩 속도, 밀리세컨드 단위의 숫자 또는 jQuery.animate()에 사용가능한 'slow', 'fast' 등
	prevBtn: '.prev',	// 이전 버튼의 jQuery 셀렉터(꼭 버튼 형태일 필요 없음)
	nextBtn: '.next',	// 다음 버튼의 jQuery 셀렉터(꼭 버튼 형태일 필요 없음)
	eventType: 'click',	// slider를 작동시킬 때 필요한 이벤트. 즉, 이전/다음 버튼에 이 이벤트가 발생하면 slider 작동
	prevEventType: null,// prev, next로 이동할 때 사용할 특별한 이벤트 타입 등록
	nextEventType: null,// 활용예) 모바일웹 개발할 때 터치 swipe(플리킹)으로 slider를 작동시키고 싶으면 이 자리에 적절한
		// 커스텀 이벤트 타입을 등록하고, 터치를 할 때 그 커스텀 이벤트를 cfSlider를 실행시킬 엘리먼트에서 발생시키면 됨
	callback: null	// 슬라이드 애니메이션이 끝나고 실행될 콜백함수, 인자로 현재 화면에 보이고 있는 아이템들의 DOM객체를 받게 됨
	// callback: function(items) {
		// console.log(items);	// 이런 식으로 사용하시면 됩니다.
	// }
});
```
