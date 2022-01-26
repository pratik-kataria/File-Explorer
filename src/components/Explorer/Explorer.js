import React, { Component } from 'react';
import cx from 'classnames';
import styles from './Explorer.module.css';

class Explorer extends Component {

    constructor () {
        super();
        this.state = {
            currFolder : 0,
            folders : new Map(),
            lastId : 3,
            breadcrumbs:[],
            tree : null,
        }  
        this.createFolder = this.createFolder.bind(this);
    }


    componentDidMount(){
        const folders = this.state.folders;
        const breadcrumbs = this.state.breadcrumbs;
        const rootFolder = {
            parent : null,
            folderId: 0,
            name : "Root",
            children : [1,2],
            type : "Folder"
        };
        folders.set(0 , rootFolder);
        folders.set(1 , {
            parent : 0,
            folderId: 1,
            name : "Folder 1",
            children : [3],
            type : "Folder"
        });
        folders.set(2 , {
            parent : 0,
            folderId: 2,
            name : "Folder 2",
            children : [],
            type : "Folder"
        });
        folders.set(3 , {
            parent : 1,
            folderId: 3,
            name : "Folder 3",
            children : [],
            type : "Folder"
        });
        breadcrumbs.push(rootFolder);

        this.setState({folders});
        
        // console.log(this.state.folders)
    }
    getCurrentFolderName() {
        if(!this.state.folders.get(this.state.currFolder))
        {
            return;
        }
        return this.state.folders.get(this.state.currFolder).name;
    }


    itemClicked(folder) {
        if(folder.type.toLowerCase() !== "folder")
        {
            alert("File Opened");
            return;
        }
        const breadcrumbs = this.state.breadcrumbs;
        breadcrumbs.push(folder);

        this.setState({currFolder : folder.folderId , breadcrumbs}); 
    }

    getAllChildren() {
        if(!this.state.folders.get(this.state.currFolder))
        {
            return;
        }
        const currFolder = this.state.currFolder;
        let children = [];
        children = this.state.folders.get(currFolder).children.map(c => {
            return this.state.folders.get(c);
        })
        return children;
    }
    createFolder(){
        const parent = this.state.currFolder;
        const generatedFolderId = this.state.lastId + 1;
        const folder = {
            parent,
            folderId: generatedFolderId,
            name : "New Folder",
            children : [],
            type : "Folder"
        }
        // get structure
        const folders = this.state.folders;
        // create a folder in the structure
        folders.set(generatedFolderId , folder);
        console.log(folders);
        // add this folder as the child of the current folder
        const currFolder = folders.get(parent);
        currFolder.children.push(generatedFolderId);
        this.setState({folders , lastId : generatedFolderId});
    }


    renameFolder(folder)
    {
       
        const input = document.getElementById(`input-folder-${folder.folderId}`)
        const newFolderName = input.value;
        if(!newFolderName || newFolderName.length === 0)
        {
            return;
        }
        const folders = this.state.folders;
        folder.name = newFolderName;
        folders.set(folder.id , folder);
        this.setState({folders});
        input.value = "";
    }
    
    changePath(index)
    {
        const breadcrumbs = this.state.breadcrumbs;
        breadcrumbs.splice(index+1);
        const toFolder = breadcrumbs[index];
        this.setState({breadcrumbs , currFolder : toFolder.folderId});
    }



    displayTree(){
        if(!this.state.folders.get(0))
        {
            return;
        }
        const divs = [];
        const rootFolder = this.state.folders.get(0);
        // console.log(rootFolder);
        let stack = [];
        
        stack.push(rootFolder);
        // console.log(stack);
        while(stack.length > 0 )
        {
            
            const folder = stack[stack.length -1];
            const div = <div className = {styles.path} onClick={() => {
                this.itemClicked(folder)
            }}>
                {folder.name}
            </div>
            divs.push(div);
           
            stack.length = stack.length - 1
            const children = folder.children
            for(let i=children.length - 1 ; i>=0 ; i--)
            {  
                const f = this.state.folders.get(children[i])
              
                stack.push(f);
               
            }
            // console.log(stack);
        }

        // this.setState({tree : divs})
       return divs;

    }
    

    render() {
        const currFolder = this.getCurrentFolderName();
        const children = this.getAllChildren()
        const breadcrumbs = this.state.breadcrumbs;
        return (
            <div className='main'>
                Folder Name : {currFolder}
                
                <div className={styles.flex}>
                    Path: 
                    {breadcrumbs && breadcrumbs.map((folder , index) => {
                        return (
                            <div className={styles.path} onClick={() => {
                                this.changePath(index)
                            }}>
                                {folder.name} {" > "}
                            </div>
                        );
                    }) }
                </div>
                <div>
                    Contents of {currFolder} : 
                </div>

                <button onClick={this.createFolder}> Add a new Folder</button>
                <div className={styles.container}>
                    {/* should have child id as well */}
                    {children && children.map(child => {
                        return (<div><div key={child.folderId} className={styles.folder} onClick={()=>{
                            this.itemClicked(child)
                        }}>
                            {child.name}
                        </div>
                            <input id={`input-folder-${child.folderId}`}></input>
                            <br></br>
                            <button onClick={() => {
                                this.renameFolder(child)
                            }}>Save</button>
                        </div>)
                    })}
                </div>
                
                <div className={styles.tree}>
                    Tree of the folder Structure: 
                </div>
                {/* <div onClick={() => {
                    this.displayTree()
                }}>
                    Display folder Structure
                </div> */}
                <div>
                {this.displayTree()}
                </div>

                
                
            </div>

            
        );
    }
}

export default Explorer;