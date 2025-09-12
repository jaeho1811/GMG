// ZEP 미니게임용: 위젯 없이 채팅과 라벨만 사용하는 초성 퀴즈

const WORDS = [
    "환경오염", "재활용", "분리배출", "그린피스", "미세플라스틱", "이산화탄소", "지구온난화"
];

function cho_hangul(str) {
    const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    let result = "";
    for (let i = 0; i < str.length; ++i ) {
        let code = str.charCodeAt(i)-44032;
        if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
        else result += str.charAt(i);
    }
    return result;
}

let _timer = 60;
let _answer = "";
let _choanswer = "";
let _playing = false;
let _playerId = null;

function startGame(player) {
    _playing = true;
    _playerId = player.id;
    _timer = 60;
    nextQuiz(player);
}

function nextQuiz(player) {
    _answer = WORDS[Math.floor(Math.random() * WORDS.length)];
    _choanswer = cho_hangul(_answer);
    App.showCenterLabel(
        `초성 퀴즈!\n힌트: ${_choanswer}\n(정답을 채팅으로 입력하세요)\n남은 시간: ${_timer}`,
        0xFFFFFF, 0x000000, 120
    );
}

App.onStart.Add(function() {
    App.showCenterLabel("초성 퀴즈 미니게임!\n'/시작'을 채팅으로 입력해 시작하세요.", 0xFFFFFF, 0x000000, 120);
});

App.onSay.add(function(player, text) {
    if (!_playing && text === "/시작") {
        startGame(player);
        return false;
    }
    if (_playing && player.id === _playerId) {
        if (text === _answer) {
            _timer += 10;
            App.showCenterLabel("정답입니다! +10초", 0x00FF00, 0x000000, 120);
            setTimeout(() => nextQuiz(player), 1500);
        } else {
            _timer -= 10;
            App.showCenterLabel("오답입니다! -10초", 0xFF0000, 0x000000, 120);
            setTimeout(() => {
                if (_timer <= 0) {
                    App.showCenterLabel("지구 멸망! 게임 종료", 0xFF0000, 0x000000, 120);
                    _playing = false;
                } else if (_timer >= 100) {
                    App.showCenterLabel("지구 환경 회복! 게임 종료", 0x00FF00, 0x000000, 120);
                    _playing = false;
                } else {
                    nextQuiz(player);
                }
            }, 1500);
        }
        return false; // 채팅창에 표시 안함
    }
});