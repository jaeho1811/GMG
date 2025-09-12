const STATE_INIT = 3000;
const STATE_READY = 3001;
const STATE_PLAYING = 3002;
const STATE_JUDGE = 3004;
const STATE_END = 3005;

const WORD_LINES = [
    '환경오염, 재활용, 분리배출,그린피스,미세플라스틱,이산화탄소,지구온난화'
];

let WORDS = [];

let _state = STATE_INIT;
let _stateTimer = 0;
let _timer = 0;
let _choanswer = '';
let _answer = '';
let _start = false;
let _widget = null; // using for contents UI
let _players = App.player;
let _result = '';

for(let w in WORD_LINES)
    WORDS =  WORDS.concat(WORD_LINES[w].trim().split(' '));

function cho_hangul(str) {
    cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    result = "";
    for (let i = 0; i < str.length; ++i ) {
      code = str.charCodeAt(i)-44032;
      if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
      else result += str.charAt(i);
    }
    return result;
}

App.onStart.Add(function(){
    startState(STATE_INIT);
});

// when chatting event
// 채팅을 치면 호출되는 이벤트
// player : person who chatted
// text : chat text
// return : enter chatting box
// return false or true : not appear in chatting box
App.onSay.add(function(player, text) {
    if(_state == STATE_PLAYING)
    {
        if(_answer == text)
        {
            _result = player.name + '님 정답!\n정답은 ' + _answer;

            startState(STATE_JUDGE);
        }
    }
});

function startState(state) {
    _state = state;
    _stateTimer = 0;

    switch(_state)
    {
        case STATE_INIT:
            if(_widget)
            {
                _widget.destroy();
                _widget = null;
            }
            _answer = WORDS[Math.floor(Math.random() * WORDS.length)];
            _timer = 60;
    
            _choanswer = cho_hangul(_answer);
    
            // called html UI
            // param1 : file name
            // param2 : position 
            // [ top, topleft, topright, middle, middleleft, middleright, bottom, bottomleft, bottomright, popup ]
            // param3 : width size
            // param4 : height size
            _widget = App.showWidget('widget.html', 'top', 200, 300);
            
            _widget.sendMessage({
                state: _state,
                timer: _timer,
                answer: _choanswer,
            });

            startState(STATE_READY);
            break;
        case STATE_READY:
            _start = true;
            startState(STATE_PLAYING);
            break;
        case STATE_PLAYING:
            App.showCenterLabel('목표: 초성힌트로 단어를 찾아내세요.',0xFFFFFF, 0x000000, 115);
            _widget.sendMessage({
                state: _state,
                timer: _timer,
                answer: _choanswer,
            });
            break;
        case STATE_JUDGE:
            break;
        case STATE_END:
            if(_widget)
            {
                _widget.destroy();
                _widget = null; // must to do for using again
            }

            _start = false;
            break;
    }
}

App.onLeavePlayer.Add(function(p) {
    p.title = null;
    p.sprite = null;
    p.moveSpeed = 80;
    p.sendUpdated();
});

App.onDestroy.Add(function() {
    _start = false;
    
    if(_widget)
    {
        _widget.destroy();
        _widget = null;
    }
});

App.onUpdate.Add(function(dt) {
    if(!_start)
        return;

    _stateTimer += dt;

    switch(_state)
    {
        case STATE_INIT:
            break;
        case STATE_READY:
            _start = true;
            break;
        case STATE_PLAYING:
            if(_stateTimer >= 1)
            {
                _stateTimer = 0;
                _timer -= 1;
            }

            if(_timer == 0)
            {
                _result = '정답은 ' + _answer + ' 입니다.';
                startState(STATE_JUDGE);
            }
            break;
        case STATE_JUDGE:
            App.showCenterLabel(_result, 0xFFFFFF, 0x000000, 115);

            if(_stateTimer >= 3)
                startState(STATE_END);
            break;
        case STATE_END:
            break;
    }
});