interface ExperienceDetailImagesProps {
  images: { id: number; imageUrl: string }[];
}

export default function ExperienceDetailImages({
  images,
}: ExperienceDetailImagesProps) {
  return (
    <section className="pt-8 lg:pt-0">
      {/* 이미지가 없을 때: 회색 프레임 표시 */}
      {!images?.length ? (
        <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
          이미지가 없습니다
        </div>
      ) : images.length === 3 ? (
        // 3장일 때: 왼쪽 1개 + 오른쪽 2개 (3분할)
        <div className="grid grid-cols-[2fr_1fr] grid-rows-2 gap-4 h-[400px]">
          <img
            src={images[0].imageUrl}
            alt="대표 이미지"
            className="row-span-2 w-full h-full object-cover rounded-2xl"
          />
          <img
            src={images[1].imageUrl}
            alt="보조 이미지 1"
            className="w-full h-full object-cover rounded-2xl"
          />
          <img
            src={images[2].imageUrl}
            alt="보조 이미지 2"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      ) : (
        // 기본 2열 그리드 (1, 2, 4장 이상)
        <div className="grid grid-cols-2 gap-4">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt={`체험 이미지 ${img.id}`}
              className="w-full h-auto object-cover rounded-2xl"
            />
          ))}
        </div>
      )}
    </section>
  );
}
