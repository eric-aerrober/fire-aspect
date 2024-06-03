Now we will choose the next action to take. Below are the tools allowed for this action. Please select as many as you wish to be invoked. They will all be invoked in parallel and the results will be returned to you for further processing. Some goals may require multiple tools to be invoked in a specific order, so consider what you can do to reach the end state and what would be the best next step to move towards that goal.

Remember that you do not have to solve the entire problem in one step. This is but one step in a multi step workflow. Your overall goal is to progress towards the end state, not jump directly to it if that jump is not possible. Take the largest step you can that moves you closer to the end state.

Tools:

{{tools}}


---

Here are some ideas for you to help you determine the right path here:

1. If you need more information, is there a tool that can help you gather that information?

2. If you have the information you need, is there a tool to take an action to move you closer to your goal?

3. If your goal is not immediately reachable, is there a tool that can help you break it down into smaller steps?

4. If there is no path forward whatsoever, you do not need to select a tool and insted the tool array should be empty. You should still provide a plan and a problem statement.

---

Please respond with valid pretty json in the below format so the system can parse your results and act acordingly.

{
    "problem": "you own description of the problem we are trying to solve",
    "plan": "the high level plan you have in mind to solve the problem across one or many steps",
    "tools": [
        {
            "toolId": "the id of the tool you want to use",
            "toolUse": "what this tool will do for us in solving the problem",
            "params": {
                [paramName]: [paramValue]
            }
        }
        . . . // possible many tools
    ]
}