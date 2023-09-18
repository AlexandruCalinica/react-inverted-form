import { Form } from "./form";

interface Form {
  name: string;
  surname: string;
}

export default async function Home() {
  const data: Form = {
    name: "John",
    surname: "Doe",
  };

  return (
    <main>
      <Form data={data} />
    </main>
  );
}
