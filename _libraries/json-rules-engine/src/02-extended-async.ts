import {Engine} from 'json-rules-engine';

async function setupEngine() {
    let engine = new Engine();

    let microsoftRule = {
        conditions: {
            all: [{
                fact: 'account-information',
                operator: 'equal',
                value: 'microsoft',
                path: '$.company'
            }, {
                fact: 'account-information',
                operator: 'in',
                value: ['active', 'paid-leave'],
                path: '$.status'
            }, {
                fact: 'account-information',
                operator: 'contains',
                value: '2016-12-25',
                path: '$.ptoDaysTaken'
            }]
        },
        event: {
            type: 'microsoft-christmas-pto',
            params: {
                message: 'current microsoft employee taking christmas day off'
            }
        }
    };
    engine.addRule(microsoftRule);

    engine.addFact('account-information', async (params, factData) => {
        console.log(params);
        let accountId = await factData.factValue('accountId');
        return getAccountInformation(accountId);
    });

    return engine;
}

async function getAccountInformation(accountId: unknown) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                company: 'microsoft',
                status: 'active',
                ptoDaysTaken: ['2016-12-25', '2016-12-26']
            });
        }, 1000);
    });
}



async function checkSyncEngine() {
    const engine = await setupEngine();

    let facts = {accountId: 'lincoln'};
    try {
        let {events} = await engine.run(facts);
        console.log(facts.accountId + ' is a ' + events.map((event: any) => event.params.message));
    } catch (error) {
        console.error('Error running the engine:', error);
    }
}

checkSyncEngine()
