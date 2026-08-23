"use strict";
{
// === ネット倉庫（JSONBin）の設定 ===
const BIN_ID = "6a8a43f5da38895dfe05659b"; // あきこさんのBin ID
// ※ご自身のマスターキー（$2a$10$...）に書き換えてください！
const MASTER_KEY = "$2a$10$EYKFCyKFt/nebBJYYq0uZ.44OqKYIZsj4EN5eevpnx.ivD8B3Dlmq"; 

// === 投稿・削除用の合言葉（好きなパスワードに変更してください） ===
const SECRET_PASSWORD = "0404"; 

const dateInput = document.querySelector("#diary-date");
const salesInput = document.querySelector("#diary-sales");
const contentInput = document.querySelector("#diary-content");
const saveBtn = document.querySelector("#save-diary-btn");
const diaryList = document.querySelector("#diary-list");

const btnBold = document.querySelector("#btn-bold");
const btnRed = document.querySelector("#btn-red");
const btnOrange = document.querySelector("#btn-orange");
const btnBig = document.querySelector("#btn-big");

// 画面を開いたときにネット倉庫から読み込む
displayDiaries();

// 文字装飾を行う関数
function insertTag(startTag, endTag) {
  const start = contentInput.selectionStart;
  const end = contentInput.selectionEnd;
  const text = contentInput.value;
  const selectedText = text.substring(start, end);

  const replacement = startTag + selectedText + endTag;
  contentInput.value = text.substring(0, start) + replacement + text.substring(end);
  contentInput.focus();
}

btnBold.addEventListener("click", () => insertTag("<b>", "</b>"));
btnRed.addEventListener("click", () => insertTag("<span style='color:red;'>", "</span>"));
btnOrange.addEventListener("click", () => insertTag("<span style='color:orange;'>", "</span>"));
btnBig.addEventListener("click", () => insertTag("<span style='font-size:1.2em; font-weight:bold;'>", "</span>"));

// 1. ネット倉庫から日誌データを取ってくる関数
async function getDiariesFromCloud() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": MASTER_KEY }
    });
    const data = await res.json();
    return data.record.diaries || [];
  } catch (error) {
    console.error("読み込みエラー:", error);
    return [];
  }
}

// 2. ネット倉庫に日誌データを保存する関数
async function saveDiariesToCloud(diaries) {
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
      },
      body: JSON.stringify({ diaries: diaries })
    });
  } catch (error) {
    console.error("保存エラー:", error);
    alert("保存に失敗しました...");
  }
}

// 「保存する」ボタンが押されたとき
saveBtn.addEventListener("click", async () => {
  const date = dateInput.value;
  const sales = salesInput.value;
  const content = contentInput.value;

  if (!date || !content) {
    alert("日付と本文を入力してください！");
    return;
  }

  // ★合言葉の確認
  const inputPassword = prompt("店主用パスワード（合言葉）を入力してください：");
  if (inputPassword !== SECRET_PASSWORD) {
    alert("合言葉が違います。投稿できませんでした。");
    return;
  }

  saveBtn.textContent = "送信中...";
  saveBtn.disabled = true;

  const savedDiaries = await getDiariesFromCloud();
  const newDiary = {
    date: date,
    sales: sales || 0,
    content: content
  };

  savedDiaries.unshift(newDiary);
  await saveDiariesToCloud(savedDiaries);

  dateInput.value = "";
  salesInput.value = "";
  contentInput.value = "";
  saveBtn.textContent = "💾 保存して投稿する";
  saveBtn.disabled = false;

  alert("ネット上に日誌を公開しました！");
  displayDiaries();
});

// 日誌の削除
async function deleteDiary(index) {
  // ★合言葉の確認
  const inputPassword = prompt("削除するには店主用パスワード（合言葉）を入力してください：");
  if (inputPassword !== SECRET_PASSWORD) {
    alert("合言葉が違います。削除できませんでした。");
    return;
  }

  if (confirm("本当にこの日誌を削除してもよろしいですか？")) {
    const savedDiaries = await getDiariesFromCloud();
    savedDiaries.splice(index, 1);
    await saveDiariesToCloud(savedDiaries);
    displayDiaries();
  }
}

// 画面に並べる関数
async function displayDiaries() {
  diaryList.innerHTML = "<p>ネットから日誌を読み込んでいます...</p>";
  const savedDiaries = await getDiariesFromCloud();
  diaryList.innerHTML = "";

  if (savedDiaries.length === 0) {
    diaryList.innerHTML = "<p>まだ公開された日誌はありません。</p>";
    return;
  }

  savedDiaries.forEach((diary, index) => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "15px";
    card.style.marginBottom = "15px";
    card.style.borderRadius = "8px";
    card.style.backgroundColor = "#fff";

    card.innerHTML = `
      <h4>📅 日付：${diary.date}</h4>
      <p>💰 本日の売上：<strong>${diary.sales}</strong> 月幣</p>
      <p>📝 <strong>メモ・出来事：</strong><br>${diary.content.replace(/\n/g, "<br>")}</p>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ この日誌を削除";
    deleteBtn.style.backgroundColor = "#ff4d4d";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "5px 10px";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.addEventListener("click", () => deleteDiary(index));

    card.appendChild(deleteBtn);
    diaryList.appendChild(card);
  });
}
}  