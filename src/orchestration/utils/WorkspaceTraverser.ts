import fs from 'fs'

type WorkspaceFileNode = {
    type: 'file'
    absolutePath: string,
    relativePath: string
    bytes?: number
    lines?: number
    summary?: string
    content?: string
}

type WorkspaceDirectoryNode = {
    type: 'directory'
    relativePath: string
    things: number
    leaves: number
    children: WorkspaceNode[]
    opened: boolean
}

type WorkspaceNode = WorkspaceFileNode | WorkspaceDirectoryNode


export class WorkspaceTraverser {

    private rootNode: WorkspaceNode = {
        type: 'directory',
        relativePath: '',
        children: [],
        things: -1,
        leaves: -1,
        opened: false
    }

    constructor (
        private workspacePath: string,
        private onSummarizeFile: (path: string) => Promise<string>
    ) {
        console.log('Workspace path:', workspacePath)
        this.constructTree(this.rootNode, "")
    }

    
    /*
        Setup workspace tree
    */
    private constructTree (node: WorkspaceNode, path: string) {
        
        if (node.type === 'file') return 1;

        const files = fs.readdirSync(this.getPathTo(path))
        const dataCollected = { totalLeaves: 0 }

        for (const file of files) {

            const fullPath = `${path}/${file}`
            const relativePath = '/' + file
            const stats = fs.statSync(this.getPathTo(fullPath))
            
            if (stats.isDirectory()) {
                const newNode: WorkspaceDirectoryNode = {
                    type: 'directory',
                    relativePath,
                    children: [],
                    things: -1,
                    leaves: -1,
                    opened: false
                }
                node.children.push(newNode)
                dataCollected.totalLeaves += this.constructTree(newNode, fullPath)
            } else {
                const fileContent = fs.readFileSync(this.getPathTo(fullPath), 'utf-8')
                const bytes = Buffer.byteLength(fileContent)
                const lines = fileContent.split('\n').length
                node.children.push({
                    type: 'file',
                    absolutePath: fullPath,
                    relativePath,
                    summary: '',
                    bytes: bytes,
                    lines: lines
                })
                dataCollected.totalLeaves += 1
            }
        }

        node.leaves = dataCollected.totalLeaves
        node.things = node.children.length
        return dataCollected.totalLeaves;
    }

    /*
        Utility functions
    */

    private getPathTo (path: string) {
        return `${this.workspacePath}${path}`
    }

    private findClosestNode (path: string, node = this.rootNode): WorkspaceNode {
        
        if (!path || path.length === 0) return node;
        
        const givenPath = path.startsWith('/') ? path : `/${path}`
        const parts = givenPath.split('/')

        console.log(parts)

        for (let i = 1; i < parts.length; i++) {
            const part = parts[i]
            const searchString = `/${part}`

            if (node.type === 'file') {
                return node;
            }

            let found = false;
            for (const child of node.children) {
                console.log('Comparing:', child.relativePath, searchString)
                if (child.relativePath === searchString) {
                    node = child;
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log('Could not find:', searchString)
                return node;
            }
        }

        return node;
    }

    private isFullyTraversed (node: WorkspaceNode) {

        if (node.type === 'file') return true;

        if (node.children.length === 0) return true;

        for (const child of node.children) {
            if (!this.isFullyTraversed(child)) {
                return false;
            }
        }

        return true;

    }

    /*
        Actions
    */
    

    public async open (path: string) {
        
        const node = this.findClosestNode(path)
        if (node.type === 'file') return

        let sumarizedCount = 0;
        
        for (let i = 0; i < node.children.length; i++) {

            const child = node.children[i]

            if (child.type === 'file') {
                await this.summarize(child.absolutePath)
                sumarizedCount += 1
                if (sumarizedCount >= 5) {
                    break;
                }
            }
        }

        node.opened = true
    }

    public async summarize (path: string) {
        const node = this.findClosestNode(path)
        if (node.type === 'directory') return
        const fullPath = `${this.workspacePath}${node.absolutePath}`
        const summary = await this.onSummarizeFile(fullPath)
        node.summary = summary
        return;
    }

    public async read (path: string) {
        const node = this.findClosestNode(path)
        console.log(`Trying to read path: ${path} and is resolved to node:`, node.relativePath, node.type)
        if (node.type === 'directory') return
        const fullPath = `${this.workspacePath}${node.absolutePath}`
        const content = await fs.promises.readFile(fullPath, 'utf-8')
        node.content = content
        return;
    }

    public describeWorkspace () {

        const workspaceStructureObject : any = {}
        const enumeratedFiles : {path: string, content: string}[] = []
        const fullyTraversal = this.isFullyTraversed(this.rootNode)

        const addToStructure = (node: WorkspaceNode, obj: any) => {
            if (node.type === 'file') {
                obj[node.relativePath] = {
                    type: 'file',
                    absolutePath: node.absolutePath,
                    relativePath: node.relativePath,
                    bytes: node.bytes,
                    lines: node.lines,
                    summary: node.summary
                }
                if (node.content) {
                    enumeratedFiles.push({
                        path: node.absolutePath,
                        content: node.content
                    })
                }
            } else {
                obj[node.relativePath] = {
                    type: 'directory',
                    numberOfThingsInDirectory: node.things,
                    numberOfFilesRecursivelyInDirectory: node.leaves,
                }
                if (!node.opened) {
                    obj[node.relativePath].note = "We have not traversed this directory yet to list specific files."
                } else {
                    obj[node.relativePath].children = {}
                    for (const child of node.children) {
                        addToStructure(child, obj[node.relativePath].children)
                    }
                }
            }            
        }

        // Build the structure object for the directory tree
        addToStructure(this.rootNode, workspaceStructureObject)

        workspaceStructureObject['AllFilesHaveBeenFullyTraversed'] = fullyTraversal

        return {
            workspaceStructure: workspaceStructureObject,
            enumeratedFileString: enumeratedFiles.map(f => 
                `---------------------- File: ${f.path}\n\n${f.content}\n\n END OF FILE ----------------------\n`
            ).join('\n')
        }
    }

}