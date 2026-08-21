"use strict";
{
  // // liタグ（メニューの項目）をぜんぶ集める
  // const menuItems = document.querySelectorAll("li");

  // // 画面下の「まだ選ばれていません」の部分を取得する
  // const selectedItem = document.querySelector("#selected-item");

  // // 集めたliタグを1つずつループ処理！
  // menuItems.forEach((item) => {
  //   // 1つ1つのメニューに「クリックを聴くリスナー」を仕掛ける
  //   item.addEventListener("click", () => {
  //     // クリックされたメニューの文字（item.textContent）を、画面下にセット！
  //     selectedItem.textContent = item.textContent;
  //   });
  // });

// メニューの項目（liタグ）を取得
const menuItems = document.querySelectorAll("#burger-list li, #drink-list li");

// カートのリストと、合計金額を表示する場所を取得
const cartList = document.querySelector("#cart-list");
const totalPriceElement = document.querySelector("#total-price");

// 合計金額を覚えておくための箱（最初は0）
let totalPrice = 0;

// カートが空かどうかを判定するフラグ（目印）
let isFirstItem = true;

// メニュー1つずつにクリックイベントを設定
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    // クリックされたメニューのテキスト（例: "満月チーズバーガー - 850月幣"）を取得
    const text = item.textContent;

    // テキストから「数字（お値段）」だけを抜き出す
    // 例: "850月幣" から 850 という数字を取り出す
    const priceMatch = text.match(/(\d+)月幣/);
    
    if (priceMatch) {
      const price = parseInt(priceMatch[1]); // 文字列の数字を「計算できる数値」に変換

      // 初めて商品をクリックしたときは「まだ何も選ばれていません」を消す
      if (isFirstItem) {
        cartList.innerHTML = ""; // カートの中身をリセット
        isFirstItem = false;
      }

      // カート（ul）の中に、新しいli要素（注文した商品）を追加する
      const newCartItem = document.createElement("li");
      newCartItem.textContent = text;
      cartList.appendChild(newCartItem);

      // 合計金額に、今回の商品の値段を足し算する
      totalPrice += price;

      // 画面上の合計金額を更新する
      totalPriceElement.textContent = totalPrice;
    }
  });
});

// ==========================================
// 1. カート内のアイテムをクリックして「個別に消す」機能
// ==========================================
cartList.addEventListener("click", (event) => {
  // クリックされたのが <li> タグ（カートの中身）の場合だけ処理する
  if (event.target.tagName === "LI" && !isFirstItem) {
    const text = event.target.textContent;
    const priceMatch = text.match(/(\d+)月幣/);

    if (priceMatch) {
      const price = parseInt(priceMatch[1]);

      // 合計金額から、消した商品の値段を引く！
      totalPrice -= price;
      totalPriceElement.textContent = totalPrice;

      // クリックされたアイテム自体を画面から削除！
      event.target.remove();

      // もしカートが空っぽになったら、「まだ何も選ばれていません」に戻す
      if (cartList.children.length === 0) {
        cartList.innerHTML = "<li>まだ何も選ばれていません</li>";
        isFirstItem = true;
      }
    }
  }
});

// ==========================================
// 2. 「カートを空にする」ボタンで一気にリセットする機能
// ==========================================
const clearBtn = document.querySelector("#clear-btn");

clearBtn.addEventListener("click", () => {
  // カートの中身を初期状態に戻す
  cartList.innerHTML = "<li>まだ何も選ばれていません</li>";
  
  // 合計金額を0に戻す
  totalPrice = 0;
  totalPriceElement.textContent = 0;

  // 1個目フラグをリセットする
  isFirstItem = true;
});
}