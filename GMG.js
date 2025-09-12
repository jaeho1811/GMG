// zepScript에서 실행되는 코드로 변환

let _timer = 50;
const 정답 = "option1"; // 정답을 원하는 값으로 설정

function showChoice() {
    zepScript.showPopup("어떤 선택지를 고르시겠습니까?", [
        { label: "선택지 1", value: "option1" },
        { label: "선택지 2", value: "option2" }
    ], function(selected){
        if(selected === 정답) {
            _timer += 10;
        } else {
            _timer -= 10;
        }

        if(_timer <= 0){
            zepScript.showPopup("지구 멸망! 게임 종료");
        } else if(_timer >= 100){
            zepScript.showPopup("지구 환경 회복! 게임 종료");
        } else {
            zepScript.showPopup("현재 시간: " + _timer, [
                { label: "다음 선택", value: "next" }
            ], function() {
                showChoice();
            });
        }
        console.log("선택된 값:", selected, "timer:", _timer);
    });
}

zepScript.onInit(function() {
    showChoice();
});