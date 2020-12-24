/*
GPL License

Copyright (C) 2020 Meihan, Kaiz_JP
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

Render_KRWED60.js
Copyright (C) 2020  Meihan, Kaiz_JP

このスクリプト ファイルまたはスクリプト分の一部分(以下 スクリプト と表記します)はフリーソフトウェアです。
あなたはこれを、フリーソフトウェア財団によって発行されたGNU 一般公衆利用許諾契約書
(バージョン2か、希望によってはそれ以降のバージョンのうちどれか)の定める条件の下で再頒布または改変することができます。

このスクリプトは有用であることを願って頒布されますが、全くの無保証です。
商業可能性の保証や特定の目的への適合性は、言外に示されたものも含め全く存在しません。
詳しくはGNU 一般公衆利用許諾契約書をご覧ください。

あなたはこのスクリプトと共に、GNU 一般公衆利用許諾契約書の複製物を一部受け取ったはずです。
もし受け取っていなければ、フリーソフトウェア財団まで請求してください
(宛先は the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA)。



このスクリプトを複製、改変、転載しても構いません。

このスクリプトを複製、改変、転載する場合、以下の条文の事を行わなければなりません。
･著作権表示(パック･スクリプト製作者 Meihan パック配布者 Kaiz_JP)
･ライセンス条文、動作無保証の旨を表記する
･成果物をGPLライセンスで配布する
･その後の利用と翻案に制限が無いよう、全ての情報を含める(難読化禁止)
*/

importPackage(Packages.jp.ngt.rtm);
importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.util);
importPackage(Packages.jp.ngt.ngtlib.io);
importPackage(Packages.jp.kaiz.atsassistmod.api);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onUpdate(su) {

	var entity = su.getEntity();
	var signal = su.getEntity().getSignal();
	var isControlCar = su.getEntity().isControlCar();
	var dataMap = entity.getResourceState().getDataMap();
	var pantaState = entity.getTrainStateData(6);
	var speed = su.getSpeed();
	var notch = su.getNotch();
	var isBlower = dataMap.getInt("Button0");

	//パンタグラフ
	if (pantaState == 1) {
		su.playSound('sound_krw', 'train.ED60PantaUp', 1, 1, false);
		su.stopSound('sound_krw', 'train.ED60PantaDown');
	}
	else {
		su.playSound('sound_krw', 'train.ED60PantaDown', 1, 1, false);
		su.stopSound('sound_krw', 'train.ED60PantaUp');
	}

	//ブロワー
	var count = su.getData(0); //1秒20tick 音声スクリプトは1tickごとに値が加減算される

	if (pantaState == 1 && isBlower == 1) {
		su.playSound('sound_krw', 'train.ED60BlowerOn', 1, 1, false);
		su.stopSound('sound_krw', 'train.ED60Stop');

		if (count <= 100) {
			count += 1;
		}
		if (count >= 100) {
			su.playSound('sound_krw', 'train.ED60BlowerLoop', 1, 1);
		}
	}

	else if (isBlower != 1) {
		count = 0;
		su.stopSound('sound_krw', 'train.ED60BlowerOn');
		su.stopSound('sound_krw', 'train.ED60BlowerLoop');
		su.playSound('sound_krw', 'train.ED60Stop', 1, 1, false);
	}

	su.setData(0, count);

	//SIV
	if (pantaState == 1 && speed > 0 && speed < 180) {
		su.playSound('sound_mhnlib', 'RTMLib.loop.loop_12', 1, 1);
	}
	else{
		su.stopSound('sound_mhnlib', 'RTMLib.loop.loop_12');
	}

	//EBエア抜け
	if(notch === -8) {
		su.playSound('sound_krw', 'train.ED60EB', 1, 1, false);
	}

	else {
		su.stopSound('sound_krw', 'train.ED60EB');
	}

	//ショック 力行時
	if (speed>0&&speed<90&& notch > 0) {
		su.playSound('sound_krw', 'train.ED60BreakerOn', 1, 1, false);
	}
	else {
		su.stopSound('sound_krw', 'train.ED60BreakerOn');
	}

	//ショック N時
	if (speed>0&&speed<90&& notch === 0) {
		su.playSound('sound_krw', 'train.ED60BreakerOff', 1, 1, false);
	}
	else {
		su.stopSound('sound_krw', 'train.ED60BreakerOff');
	}

	//軋み音
	if (speed > 0 && speed<30 && notch < 0) {
		var volSq = 1;
        	if (speed > 10) volSq = fadeCon(10, 1, 30, 0, su);
        	if (speed < 1.5) volSq = fadeCon(0.1, 0, 1.5, 1, su);
		su.playSound('sound_krw', 'train.ED60Squeak', volSq, 1);
	}
	else{
		su.stopSound('sound_krw', 'train.ED60Squeak');
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if (isControlCar) {
		
		var isOver5 = dataMap.getBoolean('isOver5');
		var isOver10 = dataMap.getBoolean('isOver10');
		var isPushHorn = dataMap.getBoolean("isPushHorn");

		//ATS超過時音声
		if (isOver5) {
			su.playSound('sound_krw', 'train.Pattern_Arr', 1, 1);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Arr');
		}

		if (isOver10) {
			su.playSound('sound_krw', 'train.Pattern_Emr', 1, 1);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Emr');
		}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		if (signal == 10) {
			su.playSound('sound_krw', 'train.Pattern_Action10', 1, 1, false);
		}

		else{
			su.stopSound('sound_krw', 'train.Pattern_Action10');
		}


		if (signal == 11) {
			su.playSound('sound_krw', 'train.Pattern_Action11', 1, 1, false);
			}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action11');
		}


		if (signal == 12) {
			su.playSound('sound_krw', 'train.Pattern_Action12', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action12');
		}


		if (signal == 13) {
			su.playSound('sound_krw', 'train.Pattern_Action13', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action13');
		}


		if (signal == 14) {
			su.playSound('sound_krw', 'train.Pattern_Action14', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action14');
		}


		if (signal == 15) {
			su.playSound('sound_krw', 'train.Pattern_Action15', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action15');
		}


		if(signal == 16){
			su.playSound('sound_krw', 'train.Pattern_Action16', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action16');
		}


		if (signal == 17) {
			su.playSound('sound_krw', 'train.Pattern_Action17', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action17');
		}


		if (signal == 18) {
			su.playSound('sound_krw', 'train.Pattern_Action18', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action18');
		}


		if (signal == 19) {
			su.playSound('sound_krw', 'train.Pattern_Action19', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action19');
		}


		if (signal == 20) {
			su.playSound('sound_krw', 'train.Pattern_Action20', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action20');
		}


		if (signal == 21) {
			su.playSound('sound_krw', 'train.Pattern_Action21', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.Pattern_Action21');
		}


		if (signal == 22) {
			su.playSound('sound_krw', 'train.Pattern_Action22', 1, 1, false);
			}
		else {

			su.stopSound('sound_krw', 'train.Pattern_Action22');
			}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//ORP音声
		if (signal == 21) {
			su.playSound('sound_krw', 'train.ATS_Stopping', 1, 1, false);
		}

		else {
			su.stopSound('sound_krw', 'train.ATS_Stopping');
		}

		if (signal == 21 && speed > 1 && speed < 25) {
			su.playSound('sound_krw', 'train.ATS_ORP', 1, 1);
		}

		else {
			su.stopSound('sound_krw', 'train.ATS_ORP');
		}

		//警笛長押し
		if (isPushHorn) {
			su.playSound('sound_krw', 'train.ED60Horn1', 1, 1, false);
			su.stopSound('sound_krw', 'train.ED60Horn2');
		}

		else {
			su.stopSound('sound_krw', 'train.ED60Horn1');
			su.playSound('sound_krw', 'train.ED60Horn2', 1, 1, false);
		}
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//↓コンプレッサー音の指定↓
var CompressorName = "train.ED60CP_Loop";
var CompressorActiveName = "train.ED60CP_On";
var CompressorEndName = "train.ED60CP_Off";
//↑コンプレッサー音の指定↑

PlayCompressor(su,CompressorName,CompressorActiveName,CompressorEndName);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (speed>0.1) {
	if (notch!=0) {

		//run1
		if (speed > 0 && speed < 5 && notch > 0) {
			var vol1 = 1.0;
			if (speed < 1) vol1 = fadeCon(0, 0.0, 1, 1.0, su);
			if (speed > 3) vol1 = fadeCon(3, 1.0, 5, 0.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_0', vol1, 1.06);
		}
		else {
	        	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_0');
		}

		//run2
		if (speed > 1 && speed < 7 && notch > 0) {
			var vol2 = 1.0;
			if (speed < 3) vol2 = fadeCon(1, 0.0, 3, 1.0, su);
			if (speed > 3) vol2 = fadeCon(5, 1.0, 7, 0.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_1', vol2, 1.06);
		}
		else {
	        	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_1');
		}

		//run3
		if (speed > 4 && speed < 8 && notch > 0) {
			var vol3 = 1.0;
			if (speed < 4) vol3 = fadeCon(4, 0.0, 6, 1.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_2', vol3, 1.06);
		}
		else {
       	 		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_2');
		}

		//run4
		if (speed > 8 && speed < 20 && notch > 0) {
			var pit4 = fadeCon(8, 0.8, 20, 1.8, su);
			var vol4 = 1.0;
			if (speed>18) vol4 = fadeCon(18, 1.0, 20, 0.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_3', vol4, pit4);
		}
		else {
	        	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_3');
		}

		//run5
		if (speed > 18 && speed < 38 && notch > 0) {
			var pit5 = fadeCon(18, 0.7, 38, 1.6, su);
			var vol5 = 1.0;
			if (speed < 19) vol5 = fadeCon(18, 0.0, 19, 1.0, su);
			if (speed > 29) vol5 = fadeCon(29, 1.0, 38, 0.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_4', vol5, pit5);
		}
		else {
	        	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_4');
		}
	}
	else {
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_0');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_1');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_2');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_3');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_4');
	}

	//run6
	if (speed > 29 && speed < 57) {
		var pit6 = fadeCon(29, 0.65, 57, 1.3, su);
		var vol6 = 1.0;
		if (speed<38) vol6 = fadeCon(29, 0.0, 38, 1.0, su);
		if (speed>46) vol6 = fadeCon(46, 1.0, 57, 0.0, su);
		su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_5', vol6, pit6);
	}
	else {
        	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_5');
	}

	//run7
	if (speed > 46 && speed < 80) {
		var pit7 = fadeCon(29, 0.65, 57, 1.3, su);
		var vol7 = 1.0;
		if (speed < 57) vol7 = fadeCon(46, 0.0, 57, 1.0, su);
		if (speed > 70) vol7 = fadeCon(70, 1.0, 80, 0.0, su);
		su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_6', vol7, pit7);
	}
	else {
        	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_6');
	}

	//run8
	if (speed > 70 && speed < 165) {
		var pit8 = fadeCon(70, 0.8, 165, 1.9, su);
		var vol8 = 1.0;
		if (speed < 80) vol8 = fadeCon(70, 0.0, 80, 1.0, su);
		su.playSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_7', vol8, pit8);
	}
	else {
        	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_7');
	}

	//EBで音が消えます
	if (notch == -8) {
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_0');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_1');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_2');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_3');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_4');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_5');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_6');
		su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_7');
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//Run30km
		if (speed > 0 && speed < 60) {
			var pit11 = fadeCon(0, 0.5, 30, 1.0, su);
			var vol11 = 1.0;
			if (speed < 10) vol11 = fadeCon(0, 0.0, 10, 1.0, su);
			if (speed > 40) vol11 = fadeCon(40, 1.0, 60, 0.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.Common.Run30km2', vol11, pit11);
		}
		else {
			su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run30km2');
		}

		//Run60km
		if (speed > 40 && speed < 90 && !su.inTunnel()) {
			var pit12 = fadeCon(60, 1.0, 90, 1.5, su),
			    vol12 = 1.0;
			if (speed < 50) vol12 = fadeCon(40, 0.0, 50, 1.0, su);
			if (speed > 70) vol12 = fadeCon(70, 1.0, 90, 0.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.Common.Run60km2', vol12, pit12);
		}
		else {
			su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run60km2');
		}

		//Run60kmT
		if (speed > 40 && speed < 90 && su.inTunnel()) {
			var pit13 = fadeCon(60, 1.0, 90, 1.5, su),
			    vol13 = 1.0;
			if (speed < 50) vol13 = fadeCon(40, 0.0, 50, 1.0, su);
			if (speed > 70) vol13 = fadeCon(70, 1.0, 90, 0.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.Common.Run60kmT3', vol13, pit13);
		}
		else {
			su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run60kmT3');
		}

		//Run120km
		if (speed > 70 && speed < 165 && !su.inTunnel()) {
			var pit14 = fadeCon(60, 0.5, 165, 1.6, su),
			    vol14 = 1.0;
			if (speed < 80) vol14 = fadeCon(70, 0.0, 80, 1.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.Common.Run120km2', vol14, pit14);
		}
		else {
			su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run120km2');
		}

		//Run120kmT
		if (speed > 70 && speed < 165 && su.inTunnel()) {
			var pit15 = fadeCon(60, 0.5, 165, 1.6, su),
			    vol15 = 1.0;
			if (speed < 80) vol15 = fadeCon(70, 0.0, 80, 1.0, su);
			su.playSound('sound_mhnlib', 'RTMLib.Run.Common.Run120kmT', vol15, pit15);
		}
		else {
			su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run120kmT');
		}

	}

//全ての音をstop処理
else {
	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_0');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_1');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_2');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_3');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.207_Tos_Re.207_4');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run30km2');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run60km2');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run60kmT3');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run120km2');
	su.stopSound('sound_mhnlib', 'RTMLib.Run.Common.Run120kmT');
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function PlayCompressor(su, CP, CPA, CPE) {
	if (su.isComplessorActive()) {
		su.playSound('sound_krw', CPA, 1, 1, false);
		su.playSound('sound_krw', CP, 1, 1);
		su.stopSound('sound_krw', CPE);
	} else {
		su.stopSound('sound_krw', CPA);
		su.stopSound('sound_krw', CP);
		su.playSound('sound_krw', CPE, 1, 1, false);
	}
}

//fadeCon(速度A,フェードA,速度B,フェードB,su);
//→速度A=フェードA、速度B=フェードBの直線の方程式に速度を当てた値を返す
//ボリュームやピッチに使用可能

function fadeCon(speed1, fade1, speed2, fade2, su) {
	var speed = su.getSpeed();
	return (((fade2 - fade1) / (speed2 - speed1)) * (speed - speed1)) + fade1;
}