function getEnumManager(name: string, enums: Array<any>) {
    const labels = enums.map((item: any) => item.label);
    const values = enums.map((item: any) => item.value);

    return {
        name,
        labels,
        values,
        enums,

        getValue: (label: string) => {
            return values[labels.indexOf(label)]
        },
        getLabel: (value: any) => {
            return labels[values.indexOf(value)]
        },
        getItem: (valueOrLabel: any | null) => {
            let index = values.indexOf(valueOrLabel)
            if (index < 0) {
                index = labels.indexOf(valueOrLabel)
            }
            return enums[index]
        }
    }
}

export const genderEnum = getEnumManager('gender', [
    { value: 0, label: '未知', type: 'info' },
    { value: 1, label: '男', type: 'info' },
    { value: 2, label: '女', type: 'info' },
])

export const userStatusEnum = getEnumManager('userStatus', [
    { value: 0, label: '正常', type: 'success' },
    { value: 1, label: '停用', type: 'danger' },
])

export const roleStatusEnum = getEnumManager('roleStatusEnum', [
    { value: 0, label: '正常', type: 'success' },
    { value: 1, label: '停用', type: 'danger' },
])