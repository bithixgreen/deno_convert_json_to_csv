import { React } from "../deps.ts";

interface IButtonProps {
  label: string;
  isDisabled: boolean;
  onClick: () => void;
}

const Button = ({ label, isDisabled, onClick }: IButtonProps) => {
  return (
    <button
      className={`btn-gen ${isDisabled ? "is-disabled" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
