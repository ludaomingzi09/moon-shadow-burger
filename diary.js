"use strict";
{

  // 入力欄とボタン、一覧表示エリアを取得
const dateInput = document.querySelector("#diary-date");
const salesInput = document.querySelector("#diary-sales");
const contentInput = document.querySelector("#diary-content");
const saveBtn = document.querySelector("#save-diary-btn");
const diaryList = document.querySelector("#diary-list");

// 画面を開いたときに、保存されている日誌を読み込んで表示する
displayDiaries();

// 「保存する」ボタンが押されたときの処理
saveBtn.addEventListener("click", () => {
  const date = dateInput.value;
  const sales = salesInput.value;
  const content = contentInput.value;

  // 日付か本文が空の場合は警告を出す
  if (!date || !content) {
    alert("日付と本文を入力してください！");
    return;
  }

  // 1日分の日誌データをまとめる（オブジェクト）
  const newDiary = {
    date: date,
    sales: sales || 0,
    content: content
  };

  // 記憶箱（localStorage）から今までの日誌を取り出す（無ければ空の配列 []）
  const savedDiaries = JSON.parse(localStorage.getItem("myDiaries")) || [];

  // 新しい日誌を配列の先頭に追加する
  savedDiaries.unshift(newDiary);

  // 記憶箱に保存し直す（文字データに変換して保存）
  localStorage.setItem("myDiaries", JSON.stringify(savedDiaries));

  // 入力欄をきれいに空っぽにする
  dateInput.value = "";
  salesInput.value = "";
  contentInput.value = "";

  alert("日誌を保存しました！");

  // 画面の一覧表示を更新する
  displayDiaries();
});

// 記憶箱から日誌を取り出して画面に並べる関数
function displayDiaries() {
  const savedDiaries = JSON.parse(localStorage.getItem("myDiaries")) || [];
  
  // 一旦表示をリセット
  diaryList.innerHTML = "";

  if (savedDiaries.length === 0) {
    diaryList.innerHTML = "<p>まだ保存された日誌はありません。</p>";
    return;
  }

  // 1件ずつカードのように画面に組み立てていく
  savedDiaries.forEach((diary) => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.marginBottom = "10px";
    card.style.borderRadius = "8px";
    card.style.backgroundColor = "#fff";

    card.innerHTML = `
      <h4>📅 日付：${diary.date}</h4>
      <p>💰 本日の売上：<strong>${diary.sales}</strong> 月幣</p>
      <p>📝 <strong>メモ：</strong><br>${diary.content.replace(/\n/g, "<br>")}</p>
    `;

    diaryList.appendChild(card);
  });
}

}  