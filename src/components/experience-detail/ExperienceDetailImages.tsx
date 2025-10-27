interface ExperienceDetailImagesProps {
  images: { id: number; imageUrl: string }[];
}

const getCornerClass = (idx: number, length: number) => {
  const last = length - 1;
  switch (idx) {
    case 0:
      return "rounded-tl-2xl";
    case 1:
      return "rounded-tr-2xl";
    case last - 1:
      return "rounded-bl-2xl";
    case last:
      return "rounded-br-2xl";
    default:
      return "";
  }
};

export default function ExperienceDetailImages({
  images,
}: ExperienceDetailImagesProps) {
  return (
    <section className="pt-8 lg:pt-0">
      {/* 이미지가 없을 때 */}
      {!images?.length ? (
        <div className="w-full aspect-[4/3] h-[245px] md:h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
          이미지가 없습니다
        </div>
      ) : images.length === 1 ? (
        // 1장일 때: 크게 하나만
        <div className="w-full aspect-[4/3] h-[245px] md:h-[400px]">
          <img
            src={images[0].imageUrl}
            alt="대표 이미지"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      ) : images.length === 2 ? (
        // 2장일 때: 반반 배치
        <div className="grid grid-cols-2 grid-rows-1 gap-3 h-[245px] md:h-[400px]">
          <img
            src={images[0].imageUrl}
            alt="소개 이미지 1"
            className="w-full h-full object-cover rounded-l-2xl"
          />
          <img
            src={images[1].imageUrl}
            alt="소개 이미지 2"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      ) : images.length === 3 ? (
        // 3장일 때: 왼쪽 세로형 + 오른쪽 두 개
        <div className="grid grid-cols-[1.4fr_1fr] grid-rows-2 gap-2 md:gap-3 h-[245px] md:h-[400px]">
          <img
            src={images[0].imageUrl}
            alt="소개 이미지1"
            className="row-span-2 w-full h-full object-cover rounded-l-2xl"
          />
          <img
            src={images[1].imageUrl}
            alt="소개 이미지 2"
            className="w-full h-full object-cover rounded-tr-2xl"
          />
          <img
            src={images[2].imageUrl}
            alt="소개 이미지 3"
            className="w-full h-full object-cover rounded-br-2xl"
          />
        </div>
      ) : (
        // 4장 이상: 기본 2열 그리드
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[245px] md:h-[400px]">
          {images.slice(0, 4).map((img, idx) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt={`체험 이미지 ${img.id}`}
              className={`w-full h-full object-cover ${getCornerClass(
                idx,
                images.length,
              )}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
