const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\herri\\.gemini\\antigravity\\brain\\c463fbe0-6460-4ec8-aae2-f3c3946ba206\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let steps = [];

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.tool_calls) {
      data.tool_calls.forEach(tc => {
        if ((tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') && tc.args && tc.args.TargetFile && tc.args.TargetFile.includes('app.js')) {
          steps.push({
            step_index: data.step_index,
            created_at: data.created_at,
            tool: tc.name,
            contentLength: tc.args.CodeContent ? tc.args.CodeContent.length : (tc.args.ReplacementContent ? tc.args.ReplacementContent.length : 0)
          });
        }
      });
    }
  } catch (e) {
    // ignore
  }
});

rl.on('close', () => {
  steps.reverse().forEach(s => {
    console.log(`Step ${s.step_index} (${s.created_at}): Tool: ${s.tool}, Content Length: ${s.contentLength}`);
  });
});
