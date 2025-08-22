zepScript.onInit(function() {
    let _timer = 50;

    function showChoice() {
        zepScript.showPopup("어떤 선택지를 고르시겠습니까?", [
            { label: "선택지 1", value: "option1" },
            { label: "선택지 2", value: "option2" }
        ], function(selected){
            if(selected === "option1") {
                _timer += 10;
            } else if(selected === "option2") {
                _timer -= 10;
            }

            if(_timer <= 0){
                zepScript.showPopup("지구 멸망");
            } else if(_timer >= 100){
                zepScript.showPopup("지구 환경 회복");
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

    showChoice();
});