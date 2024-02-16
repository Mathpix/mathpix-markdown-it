"use client";

import { MathpixMarkdown, MathpixLoader } from "mathpix-markdown-it";
import { data } from './data.js';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <MathpixLoader>
          <MathpixMarkdown text={data} htmlTags={true}/>
        </MathpixLoader>
      </div>
    </main>
  );
}
