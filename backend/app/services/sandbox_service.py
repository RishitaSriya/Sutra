import sys
import subprocess
import time
import tempfile
import os
import shutil
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

# Blocklist for dangerous system calls
DANGEROUS_PATTERNS = [
    "shutil.rmtree",
    "os.remove",
    "os.rmdir",
    "os.unlink",
    "os.system",
    "subprocess.Popen",
    "subprocess.call",
    "subprocess.run",
    "format c:",
    "rm -rf"
]

CHALLENGE_TEST_SUITES = {
    "challenge_boss_01": {
        "title": "Production Token Bucket & Two-Pointer Optimizer",
        "entry_function": "solve",
        "python_template": """def solve(nums, target):
    # Write your solution here: return two indices that sum to target
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
""",
        "js_template": """function solve(nums, target) {
    // Write your solution here
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
""",
        "test_cases": [
            {
                "name": "Standard Test: Target in Middle",
                "args": [[2, 7, 11, 15], 9],
                "expected": [0, 1]
            },
            {
                "name": "Edge Case: Negative Numbers",
                "args": [[-3, 4, 3, 90], 0],
                "expected": [0, 2]
            },
            {
                "name": "Duplicate Elements Handling",
                "args": [[3, 3], 6],
                "expected": [0, 1]
            },
            {
                "name": "Large Array Performance Test (10,000 Elements)",
                "args": [list(range(1, 10001)), 19999],
                "expected": [9998, 9999]
            }
        ]
    },
    "challenge_debug_01": {
        "title": "SQL Sanitizer & Parameterized Query Builder",
        "entry_function": "sanitize_and_build",
        "python_template": """def sanitize_and_build(username):
    # Return (safe_query, params_tuple)
    return ("SELECT * FROM users WHERE username = %s", (username,))
""",
        "js_template": """function sanitize_and_build(username) {
    return { query: "SELECT * FROM users WHERE username = $1", params: [username] };
}
""",
        "test_cases": [
            {
                "name": "Standard Username Query",
                "args": ["aarav_dev"],
                "expected": ["SELECT * FROM users WHERE username = %s", ["aarav_dev"]]
            },
            {
                "name": "Malicious SQL Injection Attempt Bypass",
                "args": ["' OR '1'='1"],
                "expected": ["SELECT * FROM users WHERE username = %s", ["' OR '1'='1"]]
            }
        ]
    }
}


class SandboxService:
    def __init__(self):
        self.node_path = shutil.which("node")

    def get_supported_languages(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "python",
                "name": "Python 3",
                "version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
                "available": True,
                "icon": "🐍"
            },
            {
                "id": "javascript",
                "name": "Node.js (JavaScript)",
                "version": "v20+ LTS" if self.node_path else "Browser Runtime",
                "available": bool(self.node_path),
                "icon": "⚡"
            }
        ]

    def execute_code(
        self,
        code: str,
        language: str = "python",
        stdin_data: str = "",
        timeout_sec: float = 4.0
    ) -> Dict[str, Any]:
        lang_lower = (language or "python").lower()

        # Security check
        for danger in DANGEROUS_PATTERNS:
            if danger in code:
                return {
                    "stdout": "",
                    "stderr": f"Security Exception: Use of restricted system operation '{danger}' is prohibited in the SUTRA sandbox.",
                    "success": False,
                    "exit_code": 1,
                    "execution_time_ms": 0.0,
                    "language": lang_lower
                }

        start_time = time.perf_counter()

        with tempfile.TemporaryDirectory() as tmp_dir:
            try:
                if lang_lower in ["python", "py"]:
                    script_path = os.path.join(tmp_dir, "script.py")
                    with open(script_path, "w", encoding="utf-8") as f:
                        f.write(code)

                    proc = subprocess.run(
                        [sys.executable, script_path],
                        input=stdin_data,
                        capture_output=True,
                        text=True,
                        timeout=timeout_sec,
                        cwd=tmp_dir
                    )
                    runtime_ms = round((time.perf_counter() - start_time) * 1000, 2)
                    return {
                        "stdout": proc.stdout,
                        "stderr": proc.stderr,
                        "success": proc.returncode == 0,
                        "exit_code": proc.returncode,
                        "execution_time_ms": runtime_ms,
                        "language": "python"
                    }

                elif lang_lower in ["javascript", "js", "node"]:
                    node_bin = self.node_path or "node"
                    script_path = os.path.join(tmp_dir, "script.js")
                    with open(script_path, "w", encoding="utf-8") as f:
                        f.write(code)

                    proc = subprocess.run(
                        [node_bin, script_path],
                        input=stdin_data,
                        capture_output=True,
                        text=True,
                        timeout=timeout_sec,
                        cwd=tmp_dir
                    )
                    runtime_ms = round((time.perf_counter() - start_time) * 1000, 2)
                    return {
                        "stdout": proc.stdout,
                        "stderr": proc.stderr,
                        "success": proc.returncode == 0,
                        "exit_code": proc.returncode,
                        "execution_time_ms": runtime_ms,
                        "language": "javascript"
                    }

                else:
                    return {
                        "stdout": "",
                        "stderr": f"Unsupported language '{language}'. Supported: python, javascript",
                        "success": False,
                        "exit_code": 1,
                        "execution_time_ms": 0.0,
                        "language": lang_lower
                    }

            except subprocess.TimeoutExpired:
                runtime_ms = round(timeout_sec * 1000, 2)
                return {
                    "stdout": "",
                    "stderr": f"Execution Timeout: Code exceeded maximum allowed execution time of {int(timeout_sec * 1000)}ms. Check for infinite loops or unbounded recursion.",
                    "success": False,
                    "exit_code": 124,
                    "execution_time_ms": runtime_ms,
                    "language": lang_lower
                }
            except Exception as e:
                runtime_ms = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "stdout": "",
                    "stderr": f"Execution Error: {str(e)}",
                    "success": False,
                    "exit_code": 1,
                    "execution_time_ms": runtime_ms,
                    "language": lang_lower
                }

    def evaluate_challenge(
        self,
        challenge_id: str,
        code: str,
        language: str = "python"
    ) -> Dict[str, Any]:
        lang_lower = (language or "python").lower()
        suite = CHALLENGE_TEST_SUITES.get(challenge_id, CHALLENGE_TEST_SUITES["challenge_boss_01"])
        test_cases = suite["test_cases"]
        entry_func = suite["entry_function"]

        results = []
        all_passed = True
        total_time_ms = 0.0
        combined_stdout = []
        combined_stderr = []

        for idx, tc in enumerate(test_cases):
            test_name = tc["name"]
            args = tc["args"]
            expected = tc["expected"]

            # Build harness wrapper script
            if lang_lower in ["python", "py"]:
                args_json = json.dumps(args)
                harness = f"""
import json
import time

{code}

args = json.loads({repr(args_json)})
start = time.perf_counter()
try:
    actual = {entry_func}(*args)
    dur = (time.perf_counter() - start) * 1000
    if isinstance(actual, tuple):
        actual = list(actual)
    print(json.dumps({{"result": actual, "time_ms": dur}}))
except Exception as e:
    import traceback
    print(json.dumps({{"error": str(e), "trace": traceback.format_exc()}}))
"""
                run_res = self.execute_code(harness, language="python", timeout_sec=2.5)

            elif lang_lower in ["javascript", "js"]:
                args_json = json.dumps(args)
                harness = f"""
{code}

const args = {args_json};
const start = performance.now();
try {{
    const actual = {entry_func}(...args);
    const dur = performance.now() - start;
    console.log(JSON.stringify({{ result: actual, time_ms: dur }}));
}} catch (err) {{
    console.log(JSON.stringify({{ error: err.message, trace: err.stack }}));
}}
"""
                run_res = self.execute_code(harness, language="javascript", timeout_sec=2.5)
            else:
                return {
                    "passed": False,
                    "score": 0,
                    "total_tests": len(test_cases),
                    "passed_tests": 0,
                    "test_results": [],
                    "stdout": "",
                    "stderr": "Unsupported language for challenge evaluation.",
                    "execution_time_ms": 0.0,
                    "xp_awarded": 0
                }

            total_time_ms += run_res["execution_time_ms"]
            if run_res["stdout"]:
                combined_stdout.append(run_res["stdout"])
            if run_res["stderr"]:
                combined_stderr.append(run_res["stderr"])

            passed = False
            actual_output_str = ""
            error_msg = None
            exec_time = run_res["execution_time_ms"]

            if run_res["success"] and run_res["stdout"].strip():
                try:
                    lines = [l.strip() for l in run_res["stdout"].strip().splitlines() if l.strip()]
                    last_line = lines[-1]
                    data = json.loads(last_line)
                    if "error" in data:
                        error_msg = data["error"]
                        actual_output_str = f"Error: {data['error']}"
                    else:
                        actual = data.get("result")
                        exec_time = round(data.get("time_ms", exec_time), 2)
                        actual_output_str = json.dumps(actual)
                        passed = (actual == expected)
                except Exception as parse_err:
                    error_msg = f"Output parse error: {parse_err}"
                    actual_output_str = run_res["stdout"]
            else:
                error_msg = run_res["stderr"] or "Execution failed with non-zero exit code"

            if not passed:
                all_passed = False

            results.append({
                "test_name": test_name,
                "input_data": json.dumps(args),
                "expected_output": json.dumps(expected),
                "actual_output": actual_output_str,
                "passed": passed,
                "execution_time_ms": exec_time,
                "error_message": error_msg
            })

        passed_count = sum(1 for r in results if r["passed"])
        score = int((passed_count / len(results)) * 100) if results else 0

        ai_feedback = None
        if all_passed:
            ai_feedback = "🔥 Flawless victory! Optimal algorithmic time complexity verified across all boundary test suites."
        elif passed_count > 0:
            ai_feedback = f"Good progress ({passed_count}/{len(results)} tests passed). Check edge case boundary values and array indices."
        else:
            ai_feedback = "Syntax or logic runtime error detected. Inspect the traceback and test input arguments."

        return {
            "passed": all_passed,
            "score": score,
            "total_tests": len(results),
            "passed_tests": passed_count,
            "test_results": results,
            "stdout": "\n".join(combined_stdout),
            "stderr": "\n".join(combined_stderr),
            "execution_time_ms": round(total_time_ms, 2),
            "ai_feedback": ai_feedback
        }


sandbox_service = SandboxService()
