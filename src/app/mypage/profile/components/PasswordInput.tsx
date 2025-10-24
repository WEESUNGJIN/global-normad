import Input from "@/components/Input";

interface Props {
  password: string;
  checkPassword: string;
  setPassword: (v: string) => void;
  setCheckPassword: (v: string) => void;
  error: string;
}

export default function PasswordInput({
  password,
  checkPassword,
  setPassword,
  setCheckPassword,
  error,
}: Props) {
  const MIN_LENGTH = 8;

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const meetsLength = password.trim().length >= MIN_LENGTH;

  const isInvalidPassword =
    password.trim().length > 0 && (!meetsLength || !hasLetter || !hasNumber);

  const isMismatch = password && checkPassword && password !== checkPassword;

  const passwordStatus =
    error.includes("비밀번호") || isInvalidPassword ? "error" : "default";
  const checkStatus = isMismatch ? "error" : "default";

  const passwordHelpText = isInvalidPassword
    ? !meetsLength
      ? "비밀번호는 8자 이상 입력해주세요."
      : !hasLetter
        ? "영문자를 포함해주세요."
        : !hasNumber
          ? "숫자를 포함해주세요."
          : "영문과 숫자를 포함해서 8자 이상 입력해주세요."
    : error.includes("비밀번호")
      ? "영문과 숫자를 포함해서 8자 이상 입력해주세요"
      : "";
  const checkHelpText = isMismatch ? "비밀번호가 일치하지 않습니다" : "";

  return (
    <>
      <Input
        label="새 비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showPasswordToggle
        placeholder="8자 이상 입력해주세요."
        status={passwordStatus}
        helpText={passwordHelpText}
        type="password"
      />
      <Input
        label="비밀번호 확인"
        value={checkPassword}
        onChange={(e) => setCheckPassword(e.target.value)}
        showPasswordToggle
        placeholder="비밀번호를 한 번 더 입력해주세요."
        status={checkStatus}
        helpText={checkHelpText}
        type="password"
      />
    </>
  );
}
