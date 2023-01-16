//定数設定
const GAME_FPS = 1000/60;
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

//裏画面（仮想画面）
let vcan = document.createElement('canvas');
let vcon = vcan.getContext('2d');

//実画面
let can = document.getElementById('can');
let con = can.getContext('2d');

//キャンバスサイズ設定
vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;
can.width = SCREEN_SIZE_W*2;
can.height = SCREEN_SIZE_H*2;

//描画をなめらかにしない
con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;

//フレームレート維持
let frameCount = 0;
let startTime;

//画像を取得
let chImg = new Image();
chImg.src = 'sprite.png';

//おじさん情報
let oji_x = 100<<4;
let oji_y = 100<<4;
let oji_vx = 0;
let oji_vy = 0;
let oji_anime = 0;
let oji_sprite = 0;
let oji_acount = 0;
let oji_dir = 0;
let oji_jump = 0;

const ANIME_JUMP = 4;
const GRAVITY = 4;

// 更新処理
function update() {

	oji_acount++;
	if(Math.abs(oji_vx)==32)oji_acount++;

	if(keyb.ABUTTON){
		if(oji_jump==0){
			oji_anime = ANIME_JUMP;
			oji_jump = 1;
		}
		if(oji_jump<15)oji_vy = -(64-oji_jump);
	}
	if(oji_jump)oji_jump++;

	//重力
	if (oji_vy<64)oji_vy+=GRAVITY;

	//床にぶつかる
	if(oji_y > 150<<4){
		if(oji_anime==ANIME_JUMP)oji_anime=1;
		oji_jump = 0;
		oji_vy = 0;
		oji_y = 150<<4;
	}


	//横移動の処理
	if(keyb.Left){
		if(oji_anime==0)oji_acount=0;
		if(!oji_jump)oji_anime = 1;
		if(!oji_jump)oji_dir = 1;
		oji_sprite += 48;
		if(oji_vx > -32)oji_vx-=1;
		//右に進んでいるとき（vxが正の値）に左キーを押したときの動き。少し早めに右へ進んでいるときに左を押すと、キュキュっとなる。
		if(oji_vx > 0)oji_vx-=1;
		if(!oji_jump&&oji_vx > 8)oji_anime = 2;
	}
	else if(keyb.Right) {
		if(oji_anime==0)oji_acount=0;
		if(!oji_jump)oji_anime = 1;
		oji_dir = 0;
		if(oji_vx < 32)oji_vx+=1;
		if(oji_vx < 0)oji_vx+=1;
		if(!oji_jump&&oji_vx < -8)oji_anime = 2;
	}
	else {
		if(!oji_jump) {
			if(oji_vx>0)oji_vx-=1;
			if(oji_vx<0)oji_vx+=1;
			if(!oji_vx) oji_anime =0;
		}
		
	}
	//毎フレームごとに加算される。歩いているときの処理に利用。
	oji_acount++;
	//最高速のとき（絶対値が32）
	if(Math.abs(oji_vx)==32)oji_acount++;

	//止まっているとき
	if(oji_anime == 0) oji_sprite = 0;
	//歩いているとき
	else if (oji_anime == 1) oji_sprite = 2 + ((oji_acount/6)%3);
	//走っていて急に方向転換するとき
	else if (oji_anime == 2) oji_sprite = 5;
	else if (oji_anime == ANIME_JUMP) oji_sprite = 6;

	//左キーボードを押している時は左向きの画像を使用
	if(oji_dir)oji_sprite += 48;

	//実際におじさんの位置（座標）を変える
	oji_x += oji_vx;
	oji_y += oji_vy;

}

//スプライトの描画
function drawSprite(snum,x,y) {
	let sx = (snum&15)*16;
	let sy = (snum>>4)*16;
	vcon.drawImage(chImg,sx,sy,16,32, x,y,16,32);
}

// 描画処理
function draw() {
	//画面を水色でクリア
	vcon.fillStyle = '#66AAFF';
	vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
	//おじさんを表示 oji_spriteはスプライト番号。
	drawSprite( oji_sprite, oji_x>>4, oji_y>>4);
	//デバッグ情報を表示
	vcon.fillStyle = '#FFF';
	vcon.fillText('Frame:'+frameCount,10,10);
	//仮想画面から実画面へ拡大転送
	con.drawImage(vcan,0,0,SCREEN_SIZE_W,SCREEN_SIZE_H,
		0,0,SCREEN_SIZE_W*2,SCREEN_SIZE_H*2);
}

//ループ開始
window.onload = function() {
	startTime = performance.now();
	mainLoop();
}

//メインループ
function mainLoop() {
	//今何フレーム目か算出
	let nowTime = performance.now();
	let nowFrame = (nowTime - startTime) / GAME_FPS;

	//現在のフレームがフレームカウントより大きければ更新・描画処理を実行
	if (nowFrame > frameCount) {
		let c = 0;
		while (nowFrame > frameCount) {
			frameCount++;
			//更新処理
			update();
			//cが4以上になったら一旦ループ止める。（つまり4フレーム分回す。）
			if ( ++c >= 4)break;
		}
		//描画処理
		draw();
	}
	requestAnimationFrame(mainLoop);
}

//キーボード
let keyb = {};
//キーボードが押されたときの処理
document.onkeydown = function(e) {
	if(e.keyCode == 37)keyb.Left = true;
	if(e.keyCode == 39)keyb.Right = true;
	if(e.keyCode == 90)keyb.BBUTTON = true;
	if(e.keyCode == 88)keyb.ABUTTON = true;
}
//キーボードが離されたときの処理
document.onkeyup = function(e) {
	if(e.keyCode == 37)keyb.Left = false;
	if(e.keyCode == 39)keyb.Right = false;
	if(e.keyCode == 90)keyb.BBUTTON = false;
	if(e.keyCode == 88)keyb.ABUTTON = false;
}