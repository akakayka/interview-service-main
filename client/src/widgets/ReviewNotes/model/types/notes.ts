export interface NoteCheckBox {
    value: string;
    isChecked: boolean;
}

export interface ReviewNotesSchema {
    isLoading: boolean;
    error?: string;
    notes: NoteCheckBox[];
    newNote: string;
}

export interface Notes {
    text: string;
    checkboxes: NoteCheckBox[];
}
