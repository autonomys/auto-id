export const BlurredBackground = () => {
  const commonStyles =
    "absolute aspect-square rounded-circle z-back blur-md top-0 bottom-0 h-3/5 m-auto";

  return (
    <div className="fixed w-screen h-screen z-back">
      <div className={`bg-[#91D3A0] left-1/6 ${commonStyles}`} />
      <div className={`bg-[#ABCFEF] left-1/2 ${commonStyles}`} />
      <div className={`bg-[#929EEA] left-1/3 ${commonStyles}`} />
    </div>
  );
};
