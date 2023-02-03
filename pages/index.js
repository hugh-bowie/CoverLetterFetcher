import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [companyInput, setCompanyInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: companyInput, job: jobInput, years: yearInput }),

      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      //setCompanyInput("");
      // setJobInput("");
      // setYearInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Letter Fetcher</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Cover Letter Fetcher</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="job"
            placeholder="Job Title"
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
          />
          <input
            type="text"
            name="years"
            placeholder="Years of Experience"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
          />
          <input type="submit" value="Generate Letter" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
