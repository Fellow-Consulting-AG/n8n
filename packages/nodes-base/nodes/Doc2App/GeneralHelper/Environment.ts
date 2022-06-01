export function getServerURL() {
    const urlIndentifier = ['stage', 'dev', 'sandbox'];
    let prefix = process.env.DB_MYSQLDB_USER ? process.env.DB_MYSQLDB_USER : 'prod';
    let serverUrl = '';

    Array.from(urlIndentifier).forEach((value: string, index: number) => {
        if (prefix === value && value !== 'prod') {
            prefix = prefix + '.';
        }
    });

    serverUrl = 'https://' + prefix +'doc2api.cloudintegration.eu';
    return serverUrl;
}

export const server_url = getServerURL();

export const api = {
    get_trigger_by_url: server_url + '/triggers/get_trigger_by_url?url=',
    create_update_trigger : server_url + '/triggers/create_update_trigger',
    remove_trigger: server_url + '/triggers/remove_trigger',
    process_documents: server_url + '/document/process_documents',
    assign_with_email: server_url + '/document/assign_with_email/',
};

