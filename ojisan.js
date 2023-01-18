//おじさんクラス

const ANIME_STAND = 1;
const ANIME_WALK 	= 2;
const ANIME_BRAKE = 4;
const ANIME_JUMP 	= 8;
const GRAVITY 		= 4;
const MAX_SPEED 	= 32;

class Ojisan{
	constructor(x,y){
		this.x = x<<4;
		this.y = y<<4;
		this.vx = 0;
		this.vy = 0;
		this.anim = 0;
		this.snum = 0;
		this.acou = 0;
		this.dirc = 0;
		this.jump = 0;
	}

	//ジャンプ処理
	updateJump(){
		//ジャンプ
		if(keyb.ABUTTON){
			if(this.jump==0){
				this.anim = ANIME_JUMP;
				this.jump = 1;
			}
			if (this.jump<15)this.vy = -(64-this.jump);
		}
		//this.jumpが0以外ならtrueとなる
		if(this.jump)this.jump++;
	}

	//横方向の移動
	updateWalkSub(dir){
		//最高速まで加速
		if(dir==0 && this.vx < MAX_SPEED)this.vx++;
		if(dir==1 && this.vx > -MAX_SPEED)this.vx--;

		//ジャンプしてないとき
		if(!this.jump){
			//立ちポーズだった時はカウンタリセット
			if(this.anim==ANIME_STAND)this.acou=0;
			//歩きアニメにする
			this.anim = ANIME_WALK;
			//方向を設定
			this.dirc = dir;
			//逆方向の時はブレーキ
			if(dir==0 && this.vx < 0)this.vx++;
			if(dir==1 && this.vx > 0)this.vx--;
			//逆に強い加速の時はブレーキアニメ
			if(dir==1 && this.vx > 8 || dir==0 && this.vx < -8)this.anim = ANIME_BRAKE;
		}

	}

	//歩く処理
	updateWalk(){
		//以下、横移動の処理
		if(keyb.Left){
			this.updateWalkSub(1);
		}
		else if(keyb.Right) {
			this.updateWalkSub(0);
		}
		else {
			if(!this.jump){
				if(this.vx>0)this.vx-=1;
				if(this.vx<0)this.vx+=1;
				if(!this.vx) this.anim = ANIME_STAND;
			}
		}
	}

	//スプライトを変える処理
	updateAnim(){
		//スプライトの決定
		//elseifが多い時はswitch文が便利。
		switch(this.anim){
			case ANIME_STAND:
				this.snum = 0;
				break;
			case ANIME_WALK:
				this.snum = 2 + ((this.acou/6)%3);
				break;
			case ANIME_JUMP:
				this.snum = 6;
				break;
			case ANIME_BRAKE:
				this.snum = 5;
				break;
		}
		//左向きの時はスプライトの48番目を使う
		if(this.dirc)this.snum += 48;
	}

	//毎フレームごとの更新処理
	update(){
		//アニメ用のカウンタ
		this.acou++;
		if(Math.abs(this.vx)==MAX_SPEED)this.acou++;

		this.updateJump();
		this.updateWalk();
		this.updateAnim();

		//重力
		if (this.vy<64)this.vy+=GRAVITY;

		//座標を変えている。
		this.x += this.vx;
		this.y += this.vy;

		//床にぶつかる
		if(this.y > 160<<4){
			if(this.anim==ANIME_JUMP)this.anim=ANIME_WALK;
			this.jump = 0;
			this.vy = 0;
			this.y = 160<<4;
		}
	}
	//毎フレームごとの描画処理
	draw(){
		//スクロールしてもおじさんが一緒についてこないように、field.scxを差し引く。
		let px = (this.x>>4) - field.scx;
		let py = (this.y>>4) - field.scy;
		drawSprite( this.snum, px, py);
	}

}