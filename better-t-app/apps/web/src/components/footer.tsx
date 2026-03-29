export default function Footer() {
  return (
    <footer className="px-4 pb-4 pt-2 md:px-6">
      <div
        className="flex flex-col items-center gap-1 px-5 py-3 rounded-3xl text-center"
        style={{
          background: "#fff",
          border: "2.5px solid #2C1A0E",
          boxShadow: "5px 5px 0 #2C1A0E",
        }}
      >
        <p className="text-xs font-bold text-espresso">
          🤖 本サイトのコンテンツ（用語解説・コース内容・産地情報など）は、生成AIによって作成されたものです。
        </p>
        <p className="text-xs text-stone-500">
          情報の正確性には十分注意していますが、誤りが含まれる場合があります。重要な判断の際は必ず一次情報をご確認ください。
        </p>
      </div>
    </footer>
  );
}
