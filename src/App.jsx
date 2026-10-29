import React, { useState, useEffect } from "react";

// ชื่อ key ที่ใช้เก็บข้อมูลใน Local Storage (ต้องใช้ชื่อเดียวกันทั้งตอน Load และ Save)
const STORAGE_KEY = "transactions";

// หมวดหมู่ให้เลือก แยกตามประเภท
const CATEGORIES = {
  expense: ["อาหาร", "เดินทาง", "ช้อปปิ้ง", "ค่าที่พัก", "บันเทิง", "อื่นๆ"],
  income: ["เงินเดือน", "ค่าขนม", "งานพิเศษ", "อื่นๆ"],
};

// ===== Load =====
// อ่านข้อมูลจาก Local Storage ถ้ายังไม่เคยบันทึกจะได้ null → คืนค่าเป็น array ว่าง
function loadTransactions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// แปลงตัวเลขเป็นรูปแบบเงินบาท เช่น 1,250.00
const formatBaht = (n) =>
  n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function App() {
  // ตัวแปรเก็บรายการทั้งหมด → ใส่ loadTransactions เป็นค่าเริ่มต้น
  // (ส่งเป็นฟังก์ชันเพื่อให้โหลดแค่ครั้งแรกที่เปิดแอป)
  const [transactions, setTransactions] = useState(loadTransactions);

  // ตัวแปรของฟอร์ม
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES.expense[0]);

  // ตัวแปรสำหรับกรองรายการ: all / income / expense
  const [filter, setFilter] = useState("all");

  // ===== Save =====
  // ทุกครั้งที่ transactions เปลี่ยน (เพิ่ม/ลบ) ให้บันทึกลง Local Storage ทันที
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // เปลี่ยนประเภท รายรับ/รายจ่าย แล้วรีเซ็ตหมวดหมู่ให้ตรงกับประเภท
  const changeType = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  // คำสั่งเพิ่มรายการ
  const addTransaction = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (title.trim() === "" || !value || value <= 0) return;

    const newItem = {
      id: Date.now(), // ใช้เวลาปัจจุบันเป็น id (ไม่ซ้ำกัน)
      type,
      title: title.trim(),
      amount: value,
      category,
      date: new Date().toISOString(),
    };
    setTransactions([newItem, ...transactions]); // ใส่รายการใหม่ไว้บนสุด
    setTitle("");
    setAmount("");
  };

  // คำสั่งลบรายการ
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // คำสั่งล้างข้อมูลทั้งหมด
  const clearAll = () => {
    if (window.confirm("ต้องการลบรายการทั้งหมดใช่ไหม?")) {
      setTransactions([]);
    }
  };

  // คำนวณยอดรวม
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  // รายการที่จะแสดงตามตัวกรอง
  const shown =
    filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-4">
        {/* ส่วนหัว + ยอดคงเหลือ */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl p-6">
          <h1 className="text-lg font-semibold opacity-90">💰 Money Note</h1>
          <p className="text-sm opacity-80 mt-4">ยอดคงเหลือ</p>
          <p className="text-4xl font-bold">฿{formatBaht(balance)}</p>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs opacity-80">รายรับ</p>
              <p className="font-semibold">+฿{formatBaht(income)}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs opacity-80">รายจ่าย</p>
              <p className="font-semibold">-฿{formatBaht(expense)}</p>
            </div>
          </div>
        </div>

        {/* ฟอร์มเพิ่มรายการ */}
        <form onSubmit={addTransaction} className="bg-white rounded-2xl shadow p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => changeType("expense")}
              className={`py-2 rounded-xl font-medium ${
                type === "expense" ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              onClick={() => changeType("income")}
              className={`py-2 rounded-xl font-medium ${
                type === "income" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              รายรับ
            </button>
          </div>

          <input
            type="text"
            placeholder="รายการ เช่น ข้าวกลางวัน"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="จำนวนเงิน"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 min-w-0 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {CATEGORIES[type].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button className="w-full bg-gray-900 text-white py-2 rounded-xl hover:bg-gray-700">
            บันทึก
          </button>
        </form>

        {/* รายการทั้งหมด */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">ประวัติรายการ</h2>
            {transactions.length > 0 && (
              <button onClick={clearAll} className="text-xs text-rose-500 hover:text-rose-700">
                ล้างทั้งหมด
              </button>
            )}
          </div>

          {/* ปุ่มกรอง */}
          <div className="flex gap-2 mb-3 text-sm">
            {[
              ["all", "ทั้งหมด"],
              ["income", "รายรับ"],
              ["expense", "รายจ่าย"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full ${
                  filter === key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">ยังไม่มีรายการ</p>
          ) : (
            <ul className="space-y-2">
              {shown.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{t.title}</p>
                    <p className="text-xs text-gray-400">
                      {t.category} ·{" "}
                      {new Date(t.date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-semibold ${
                        t.type === "income" ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}฿{formatBaht(t.amount)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="text-gray-300 hover:text-rose-500"
                      aria-label="ลบ"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          ข้อมูลถูกบันทึกใน Local Storage ของเบราว์เซอร์ — ปิดแล้วเปิดใหม่ข้อมูลยังอยู่
        </p>
      </div>
    </div>
  );
}
