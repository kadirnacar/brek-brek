declare var process: any;

export function clone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}

/**
 * Is server prerendering by Node.js.
 * There can't be any DOM: window, document, etc.
 */
export function isNode(): boolean {
    return typeof process === 'object' && process.versions && !!process.versions.node;
}

export function isObjectEmpty(obj): boolean {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function emptyForm(form: HTMLFormElement): void {
    var inputs = Array.from(form.querySelectorAll("input, select, textarea"));
    inputs.forEach(x => {
        var inputType = x.getAttribute("type");
        if (inputType === "checkbox" || inputType === "radio") {
            (x as any).checked = false;
        } else {
            (x as any).value = "";
        }
    });
}

export const enumVales = (myEnum): string[] => {
    let result: string[] = [];
    for (var enumMember in myEnum) {
        var isValueProperty = parseInt(enumMember, 10) >= 0
        if (isValueProperty) {
            result.push(myEnum[enumMember]);
        }
    }
    return result;
}

export const enumToArray = (myEnum): { id: number; title: string }[] => {
    let result = enumVales(myEnum);
    return result.map((itm) => {
        return { id: myEnum[itm], title: itm };
    })
}

export const enumToOject = (myEnum): any => {
    let result = enumVales(myEnum);
    return result.reduce((obj, item) => {
        obj[myEnum[item]] = item
        return obj
    }, {});
}

export const dataGridLocation = {
    body: {
        addTooltip: "Ekle",
        deleteTooltip: "Sil",
        editRow: {
            cancelTooltip: "İptal",
            deleteText: "Silmek istediğinize eminmisiniz?",
            saveTooltip: "Kaydet"
        },
        editTooltip: "Düzenle",
        filterRow: {
            filterTooltip: "Ara"
        },
        emptyDataSourceMessage: "Gösterilecekk Veri Yok!"
    },
    header: {
        actions: "İşlemler"
    }
};