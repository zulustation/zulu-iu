export const ClearAllBtn = ({ clear }) => {
  return (
    <button
      className="flex px-zul-10 py-zul-5 bg-white rounded-zul-5 text-black text-zul-14-150 border-gray-800 border"
      onClick={clear}
    >
      Clear All
    </button>
  );
};
