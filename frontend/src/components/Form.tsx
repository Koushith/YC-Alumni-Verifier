import { useState } from "react";
import toast from "react-hot-toast";
import { extractGitHubRepoPath, handleError } from "../utils";

export type Inputs = {
  email: string;
};

type FormProps = {
  proveIt: (input: Inputs) => Promise<void>;
};

const Form = ({ proveIt }: FormProps) => {
  const [input, setInput] = useState<Inputs>({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    proveIt(input).catch((e) => console.log(handleError(e)));
  };
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center w-full gap-5 lg:items-start text-offBlack"
    >
      <input
        type="email"
        name="email"
        required
        onChange={handleChange}
        value={input.email}
        placeholder="Your email id"
        className="w-full px-5 py-5 lg:py-3 bg-white text-offBlack rounded-xl"
      />
      {/* <input
        name="repoLink"
        required
        onChange={handleChange}
        value={input.repoLink}
        placeholder="GitHub repo link"
        className="w-full px-5 py-5 lg:py-3 bg-white text-offBlack rounded-xl"
      /> */}

      <button
        type="submit"
        className="py-5 lg:py-4 mt-5 transition-colors ease-in bg-yellow px-9 rounded-xl hover:shadow-lg"
        style={{ background: "#E76120", color: "#fff" }}
      >
        Claim Now
      </button>
    </form>
  );
};

export default Form;
