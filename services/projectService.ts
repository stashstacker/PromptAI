
import { Project, FormData } from '../types';
import { getAllProjects, bulkAddProjects, addProject } from './dbService';
import { projectForgeBlueprints } from '../constants';

/**
 * Handles reading and processing files for import.
 * @param files The FileList object from a file input.
 * @returns A promise that resolves with an object containing imported projects, skipped files, and a feedback message.
 */
export const importProjectFiles = async (files: FileList) => {
    const jsonFiles = Array.from(files).filter((f: File) => f.name.toLowerCase().endsWith('.json'));
    const txtFiles = Array.from(files).filter((f: File) => f.name.toLowerCase().endsWith('.txt'));
    
    let feedbackMessage = '';
    let loadedProject: Project | null = null;

    if (txtFiles.length > 1) {
        return { feedbackMessage: "Batch import is only for .json project files. Please select only one .txt file at a time to load it into the forge." };
    }

    const readAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    // Process JSON files for library import
    if (jsonFiles.length > 0) {
        const importedProjects: Project[] = [];
        const skippedFiles: string[] = [];

        for (const file of jsonFiles) {
            try {
                const fileContent = await readAsText(file);
                const project = JSON.parse(fileContent) as Project;
                if (project.id && project.name && project.page && project.mode && project.formData) {
                    importedProjects.push(project);
                } else {
                     skippedFiles.push(file.name);
                }
            } catch (error) {
                console.error("Error processing JSON file:", file.name, error);
                skippedFiles.push(file.name);
            }
        }

        if (importedProjects.length > 0) {
            try {
                const projectsToSave: Project[] = [];
                const allCurrentProjects = await getAllProjects();
                const existingIds = new Set(allCurrentProjects.map(p => p.id));
        
                importedProjects.forEach(p => {
                    let newId = p.id;
                    while(existingIds.has(newId)) {
                        newId = (parseInt(newId, 10) + Math.floor(Math.random() * 1000)).toString();
                    }
                    p.id = newId;
                    existingIds.add(newId);
                    projectsToSave.push(p);
                });

                await bulkAddProjects(projectsToSave);
                feedbackMessage += `${projectsToSave.length} project(s) imported successfully!`;
            } catch (error) {
                console.error("Failed to import projects:", error);
                feedbackMessage += `\nAn error occurred during import. Some projects may not have been saved.`;
            }
        }
        if(skippedFiles.length > 0) {
            feedbackMessage += `\n${skippedFiles.length} file(s) were skipped due to invalid format: ${skippedFiles.join(', ')}.`;
        }
    }

    // Process a single TXT file to load into the forge
    if (txtFiles.length === 1) {
        const file = txtFiles[0];
        try {
            const fileContent = await readAsText(file);
            
            const defaultMode = Object.keys(projectForgeBlueprints)[0];
            const blueprint = projectForgeBlueprints[defaultMode];
            const initialData: FormData = {};
            if (blueprint) {
                blueprint.fields.forEach(field => {
                    initialData[field.id] = field.type === 'list' ? [''] : '';
                });
            }

            loadedProject = {
                id: Date.now().toString(),
                name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                page: 'forge',
                mode: defaultMode || '',
                formData: initialData,
                promptOutput: fileContent,
                lastSaved: new Date().toISOString(),
                outputMode: 'text'
            };
            feedbackMessage += `${feedbackMessage ? '\n' : ''}Loaded "${file.name}" into the forge.`;
        } catch (error) {
            console.error("Error processing .txt file:", file.name, error);
            feedbackMessage += `\nError importing ${file.name}.`;
        }
    }
    
    return { feedbackMessage: feedbackMessage.trim(), loadedProject };
};

/**
 * Creates a downloadable JSON file for the project and saves it to the DB.
 * @param projectData The complete project data to export.
 */
export const exportProject = async (projectData: Project): Promise<void> => {
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = projectData.name.trim().toLowerCase().replace(/\s+/g, '_') || 'project';
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    await addProject(projectData);
};
