import Button from "@/components/Button";

interface Props {
  success: string;
}

export default function SaveButton({ success }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <Button type="submit" label="저장하기" className="py-3 px-10" />
    </div>
  );
}
