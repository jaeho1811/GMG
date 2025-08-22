let _timer = 50;
let _time = _timer; // _time 변수 선언 및 초기화

zepScript.showPopup("어떤 선택지를 고르시겠습니까?", [
    { label: "선택지 1", value: "option1" },
    { label: "선택지 2", value: "option2" },
], function(selected){
    // 사용자가 선택한 값 처리
    if(selected === "option1") {
        _timer += 10;
    } else if(selected === "option2") {
        _timer -= 10;
    }
    _time = _timer; // _time에 현재 값 반영

    if(_timer <= 0){
        zepScript.showPopup("지구 멸망");
    } else if(_timer >= 100){
        zepScript.showPopup("지구 환경 회복");
    } else {
        zepScript.showPopup("현재 시간: " + _time);
    }
    console.log("선택된 값:", selected, "time:", _time);
});