import {Engine} from 'json-rules-engine';

async function setupEngine(rules: any[], ruleHandlers: [string, (params: any, factData: any) => Promise<unknown>][] = []) {
    let engine = new Engine();

    rules.forEach((rule: any) => {
        engine.addRule(rule);
    })

    ruleHandlers.forEach(fetchFactHandler => {
        engine.addFact(fetchFactHandler[0], fetchFactHandler[1]);
    })

    return engine;
}

async function getBonusInformation(accountId: unknown) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                "event_type": "bonus_status_change",
                "user_id": 1,
                "status": "success",
                "version": "2.1",
                "request_id": "123456",
                "partner_id": 58,
                "cashdesk_id": 13,
                "time_stamp": 123456789,
                "service": "prewager@de1ef01p",
                "data": {
                    "version": 1,
                    "type": "PWB",
                    "status_from": {
                        "name": "proposed"
                    },
                    "status_to": {
                        "name": "wagering"
                    },
                    "bonus_state": {
                        "bonus_id": 1,
                        "campaign_id": 1,
                        "user_id": 444,
                        "status": "wagering",
                        "currency": "USD",
                        "bonus_amount": 10,
                        "wagered_amount": 5.3,
                        "amount_for_wager": 100.2,
                        "wagered_percent": 50.4,
                        "comment": "Test comment",
                        "activation_expired_at": "2011-08-12T20:17:46.384Z",
                        "activated_at": "2011-08-12T20:17:46.384Z",
                        "deactivated_at": "2011-08-12T20:17:46.384Z",
                        "created_at": "2011-08-12T20:17:46.384Z",
                        "updated_at": "2011-08-12T20:17:46.384Z"
                    }
                }
            });
        }, 1000);
    });
}


async function checkBonus(facts: { user_id: number }) {
    let bonusStatusRule = {
        conditions: {
            all: [
                {
                    fact: 'bonus-status-change',
                    operator: 'equal',
                    value: 'proposed',
                    path: '$.data.status_from.name'
                },
                {
                    fact: 'bonus-status-change',
                    operator: 'equal',
                    value: 'wagering',
                    path: '$.data.status_to.name'
                }
            ]
        },
        event: {
            type: 'set-bonus-status-wagering',
            params: {
                message: 'Bonus status has been set to wagering'
            }
        }
    };


    const engine = await setupEngine([bonusStatusRule], [['bonus-status-change', async (params, factData) => {
        const id = await factData.factValue('user_id');
        return getBonusInformation(id);
    }]]);

    try {
        let {events} = await engine.run(facts);
        console.log('user with id ' + facts.user_id + ' ' + events.map((event: any) => event.params.message));
    } catch (error) {
        console.error('Error running the engine:', error);
    }
}

checkBonus({user_id: 1})
