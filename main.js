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

//描画をなめらかにしない設定
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

//おじさんを作る
let ojisan = new Ojisan(100,100);
//フィールドを作る
let field = new Field();

// 更新処理
function update() {
	field.update();
	ojisan.update();
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

	//マップを表示
	field.draw();
	//おじさんを表示
	ojisan.draw();

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
	
	if(e.keyCode == 65)field.scx--;
	if(e.keyCode == 83)felid.scx++;
}
//キーボードが離されたときの処理
document.onkeyup = function(e) {
	if(e.keyCode == 37)keyb.Left = false;
	if(e.keyCode == 39)keyb.Right = false;
	if(e.keyCode == 90)keyb.BBUTTON = false;
	if(e.keyCode == 88)keyb.ABUTTON = false;
}