const quizList = [
{ question: "ㅎㄱㅇㅇ", answer: "환경오염" },
{ question: "ㅈㅎㅇ", answer: "재활용" },
{ question: "ㅂㄹㅂㅊ", answer: "분리배출" },
{ question: "ㄱㄹㅍㅅ", answer: "그린피스" },
{ question: "ㅁㅅㅍㄹㅅㅌ", answer: "미세플라스틱" },
{ question: "ㅇㅅㅎㅌㅅ", answer: "이산화탄소" },
{ question: "ㅈㄱㅇㄴㅎ", answer: "지구온난화" }
];

// 랜덤 배치 좌표 (예시)
const posList = [
{x: 10, y: 5},
{x: 18, y: 13},
{x: 6, y: 12},
{x: 22, y: 8},
{x: 5, y: 17},
{x: 13, y: 2},
{x: 20, y: 15}
];

// 문제 위치 매핑 및 상태 저장
let quizStatus = []; // {playerId, idx, solved}
quizList.forEach((q, i) => {
// 각 퀴즈 영역에 이벤트 설치
Map.setInteractiveObject(posList[i].x, posList[i].y, {
onInteract: (player) => {
// 해당 퀴즈가 풀렸는지 체크
const solved = quizStatus.find(e => e.playerId === [player.id](http://player.id/) && e.idx === i && e.solved);
if (solved) {
App.showCenterLabel("이미 푼 문제입니다!");
return;
}
// 퀴즈 문제(초성) 내보내기
App.showPrompt(`문제: ${quizList[i].question} (초성)\\n정답 입력:`, "", (text) => {
if (text === quizList[i].answer) {
quizStatus.push({playerId: [player.id](http://player.id/), idx: i, solved: true});
App.showCenterLabel("정답입니다! 🎉");
} else {
App.showCenterLabel("오답입니다. 다시 도전!");
}
});
}
});
});