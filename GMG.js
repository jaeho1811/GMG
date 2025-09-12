// ZEP 미니게임용: 위젯 없이 채팅과 라벨만 사용하는 초성 퀴즈

const WORDS = [
    "환경오염", "재활용", "분리배출", "그린피스", "미세플라스틱", "이산화탄소", "지구온난화", "친환경", "절약정신"
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

let _point = 0;
let _life = 3;
let _timer = 300;
let _answer = "";
let _choanswer = "";
let _playing = false;
let _playerId = null;
let _quizInterval = null;
let _quizPool = []; // 중복 방지용 문제 풀

function startGame(player) {
    _playing = true;
    _playerId = player.id;
    _timer = 300;
    _point = 0;
    _life = 3;
    _quizPool = [...WORDS]; // 문제 풀 초기화
    nextQuiz(player);
    // 문제 라벨을 계속 띄우기 위한 반복 타이머
    if (_quizInterval) clearInterval(_quizInterval);
    _quizInterval = setInterval(() => {
        if (_playing) {
            App.showCenterLabel(
                `초성 퀴즈!\n힌트: ${_choanswer}\n(정답을 채팅으로 입력하세요)\n남은 목숨: ${_life},현재 점수: ${_point}, 남은 시간: ${_timer}`,
                0xFFFFFF, 0x000000, 120
            );
        }
    }, 1000); // 3초마다 라벨 갱신
}
let _stateTimer = 0;

App.onUpdate.Add(function(dt){
	_stateTimer += dt;
	
	if(_stateTimer >= 1){
		_stateTimer = 0;
		_timer -= 1;
	}

	
	if(_timer <= 0){
			// time over then...
	}
})

function nextQuiz(player) {
    if (_quizPool.length === 0) {
        App.showCenterLabel("문제를 모두 풀었습니다! 게임 종료", 0x00FF00, 0x000000, 120);
        _playing = false;
        if (_quizInterval) clearInterval(_quizInterval);
        return;
    }
    // 문제 중복 방지: 남은 문제 중에서 랜덤 선택 후 제거
    const idx = Math.floor(Math.random() * _quizPool.length);
    _answer = _quizPool[idx];
    _quizPool.splice(idx, 1);
    _choanswer = cho_hangul(_answer);
    App.showCenterLabel(
        `초성 퀴즈!\n힌트: ${_choanswer}\n(정답을 채팅으로 입력하세요)\n남은 목숨: ${_life},현재 점수: ${_point}`,
        0xFFFFFF, 0x000000, 3000 // 3초 동안 표시
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
            _point += 1;
            App.showCenterLabel("정답입니다! +1점", 0x00FF00, 0x000000, 120);
            setTimeout(() => nextQuiz(player), 1500);
        } else {
            _life -= 1;
            App.showCenterLabel("오답입니다! 목숨 -1", 0xFF0000, 0x000000, 120);
            setTimeout(() => {
                if (_life <= 0 || _timer <= 0) {
                    App.showCenterLabel("목숨 없음 게임 종료", 0xFF0000, 0x000000, 120);
                    _playing = false;
                    if (_quizInterval) clearInterval(_quizInterval);
                } else if (_point >= 5) {
                    App.showCenterLabel("점수 5점 달성! 게임 종료", 0x00FF00, 0x000000, 120);
                    _playing = false;
                    if (_quizInterval) clearInterval(_quizInterval);
                } else {
                    nextQuiz(player);
                }
            }, 1500);
        }
        return false; // 채팅창에 표시 안함
    }
});