'use client';
import { useState } from 'react';
{/*求人カテゴリ*/}
export default function Home() {

const [view, setView] = useState<'search' | 'post'>('search');

  const jobList = [
    { id: 1, title: "Webエンジニア募集", category: "エンジニア", salary: 600 },
    { id: 2, title: "営業アシスタント", category: "営業", salary: 350 },
    { id: 3, title: "マーケティングマネージャー", category: "マーケティング", salary: 800 },
    { id: 4, title: "デザイナー募集", category: "デザイン", salary: 550 },
    { id: 5, title: "製造管理", category: "製造", salary: 650 },
    { id: 6, title: "経理マネージャー", category: "財務・経理", salary: 700 },
    { id: 7, title: "人事担当", category: "人事", salary: 500 },
    { id: 8, title: "カスタマーサポート", category: "カスタマーサポート", salary: 400 },
    { id: 9, title: "看護師募集", category: "医療・介護", salary: 550 },
    { id: 10, title: "事務スタッフ", category: "事務", salary: 300 },
  ];
{/*カテゴリ*/}
  const allCategories = [
    "事務", "エンジニア", "営業", "デザイン", "マーケティング",
    "財務・経理", "人事", "カスタマーサポート", "製造", "医療・介護"
  ];
{/*チェックして更新して更新された配列以外消す(useState＝初期値に戻したり色々状態の記録)*/}
{/*チェックボックスと同期 */}
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);  //文字列選択
  {/*[年収最小値、選択]＝それ以上の金額選択 */}
  {/*年収ver */}
  const [minSalary, setMinSalary] = useState<number | null>(null);
{/*投稿するやつ */}
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [jobs, setJobs] = useState(jobList);
{/*ペーじ */}
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10; // 1ページに表示する件数
{/*仕事の制限 */}
  const filteredJobs = jobs.filter((job) => {  //選択と表示
    const categoryMatch =  //
      selectedCategories.length === 0 || selectedCategories.includes(job.category);  //何も選ばれていない時は全て表示、何か選ばれている時にはそれを表示
    const salaryMatch =
      minSalary === null || job.salary >= minSalary;  //給与の条件が指定されていないと選ばれた最低年収以上の求人だけ表示
    return categoryMatch && salaryMatch;  //給与と上限の年収の両方を満たすと表示
  });
  // 2. ページネーション用のスライスgpt
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

const handlePrevPage = () => {
  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};


  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newJobTitle || !newJobCategory || !newJobSalary) {
      alert("すべての項目を入力してください");
      return;
    }

    const newJob = {
      id: jobs.length + 1,
      title: newJobTitle,
      category: newJobCategory,
      salary: Number(newJobSalary),
    };

    setJobs([...jobs, newJob]);
    setNewJobTitle('');
    setNewJobCategory('');
    setNewJobSalary('');
    setView('search'); 
    setCurrentPage(1);// ← 投稿完了後に一覧ページに戻る！
  };
{/*チェックボックス */}
  const handleCheckboxChange = (category: string) => {  //チェックされた文字列を
    setSelectedCategories((prev) =>  //前の文字列から
      prev.includes(category)
        ? prev.filter((c) => c !== category)  //チェック外したら削除
        : [...prev, category]  //チェックしたら追加、
    );
  };
{/*年収選択 セレクトボックスとセット */}
  const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value; //文字列から数値へ
    setMinSalary(value ? Number(value) : null);  //値がからの時は条件なしに戻して最終的にstateを更新
    setCurrentPage(1);
  };

  return (
    <div>
    {/* ヘッダー */}
    <header className="bg-blue-950 text-white p-5">
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">求人検索アプリ</div>
        <nav className="space-x-4 text-sm">
          <button onClick={() => setView('search')} className="hover:underline">求人検索</button>
          <button onClick={() => setView('post')} className="hover:underline">求人投稿</button>
        </nav>
      </div>
    </header>

    {view === 'search' && (
    //求人検索アプリから下
    <main className="flex flex-row h-screen">
      {/* サイドフィルター左 */}
      <aside className="bg-gray-200 p-4 w-1/4 h-screen overflow-y-auto">
        <h2 className="text-sm font-bold mb-2 text-black">求人カテゴリ</h2>
        <ul className="space-y-2">
          {allCategories.map((cat) => (
            <li key={cat} className="flex items-center">
  <input
    type="checkbox"
    id={cat}
    onChange={() => handleCheckboxChange(cat)}
    checked={selectedCategories.includes(cat)}
    className="appearance-none h-4 w-4 mr-2 border border-blue-400
               bg-gray-200 checked:bg-blue-400 checked:border-blue-400"
  />
  <label htmlFor={cat} className="text-xs text-gray-700">{cat}</label>
</li>

          ))}
        </ul>

        <div className="mt-6">
          <h2 className="text-sm font-bold mb-2 text-black">年収</h2>
          <select
            onChange={handleSalaryChange}
            className="w-full px-2 py-1 border border-gray-400 text-xs bg-white"
          >
            <option value="300">300万円以上 ▼</option>
            <option value="400">400万円以上 ▼</option>
            <option value="500">500万円以上 ▼</option>
            <option value="600">600万円以上 ▼</option>
            <option value="700">700万円以上 ▼</option>
            <option value="800">800万円以上 ▼</option>
          </select>
        </div>
      </aside>

      {/* メイン表示右枠 */}
      <section className="flex-1 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">求人一覧</h2>
        <p className="text-xs mb-4 text-gray-600">該当件数: {filteredJobs.length}件</p>

        <div className="grid grid-cols-1 gap-4">
          {currentJobs.map((job) => (
            <div
            key={job.id}
            className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white flex flex-col justify-start space-y-1">
              <h3 className="font-bold text-sm mb-1">{job.title}</h3>
              <p className="text-xs text-gray-600">カテゴリ: {job.category}</p>
              <p className="text-xs text-gray-600">年収: {job.salary}万円</p>
            </div>
          ))}
        </div>
{/*ページ */}
  <div className="mt-6 flex justify-center items-center space-x-2 text-sm">
  <button
    onClick={handlePrevPage}
    disabled={currentPage === 1}
  >
    ◀︎
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`${
        currentPage === i + 1
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
  >
    ▶︎
  </button>
</div>
</section>
</main>
    )}
{view === 'post' && (
     <section className="p-6">
       <h2 className="text-lg font-bold text-gray-800 mb-4">求人投稿</h2>
       <form className="space-y-4 max-w-md" onSubmit={handlePostSubmit}>
  <div>
    <label className="block text-xs mb-1">求人カテゴリ選択</label>
    <select
      value={newJobCategory}
      onChange={(e) => setNewJobCategory(e.target.value)}
      className="w-1/3 px-3 py-2 bg-white border border-gray-300 text-sm"
    >
      <option value="">カテゴリを選択 ▼</option>
      {allCategories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-xs text-gray-600 mb-1">年収（万円）</label>
    <input
      type="number"
      value={newJobSalary}
      onChange={(e) => setNewJobSalary(e.target.value)}
      className="w-1/3 px-3 py-2 border border-gray-300 text-sm"
    />
  </div>

{/*求人投稿 */}
  <div>
    <label className="block text-xs text-gray-600 mb-1">求人タイトル</label>
    <input
      type="text"
      value={newJobTitle}
      onChange={(e) => setNewJobTitle(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 text-sm"
    />
  </div>

  <button type="submit" className=" w-1/3 bg-blue-400 text-white px-4 py-2 rounded text-sm hover:bg-blue-300">
    投稿
  </button>
</form>
     </section>
   )}
 </div>
);
}