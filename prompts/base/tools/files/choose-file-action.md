You may now choose which action to take to continue on your exploration of the file system. Your actions are as follows:

1. 'sumarize' - This will invoke another bot to ask them to provide a high level summary of a given file you specify.

2. 'open' - This will open a directory and reveal all files and directories within it. It will also automatically sumarize a handful of files within the directory. You can choose to sumarize more files if you wish by using the 'sumarize' action.

3. 'read' - This will read a file and provide you with the contents of the file in full. Some files may be quite large so be careful with this action.

4. 'exit' - This will exit the traversal and provide the final state of the file structure to your invoker. If there are no longer any actions you can take, you should use this action to exit the traversal.

Remember the user's goal for this traversal is:

```
{{goal}}
```

Respond in the following prety printed JSON format so i can parse it as JSON and then automatically take the actions.

```js
{
    thought: "up to 2 sentences of your thoughts on the file system so far and what you still dont understand or need to know to answer th user's question",
    action: "sumarize" | "open" | "read" | "exit",
    target: "path to file or directory to take action on if applicable, or an empty string if not applicable. Ex: /path/to/file.txt or /path/to/directory"
}
```