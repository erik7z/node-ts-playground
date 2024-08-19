import {Engine} from 'json-rules-engine';

const rule = {
    conditions: {
        all: [
            {
                fact: "bonus_status_change",
                path: "$.data.type",
                operator: "equal",
                value: "PWB"
            },
            {
                fact: "bonus_status_change",
                path: "$.data.status_from.name",
                operator: "in",
                value: [
                    "potential", "proposed"
                ]
            },
            {
                fact: "bonus_status_change",
                path: "$.data.status_to.name",
                operator: "in",
                value: [
                    "wagering",
                    "completed"
                ]
            }
        ]
    },
    event: {
        type: "process_campaign",
        params: {
            campaign_id: 1
        }
    }
}

let fact = {
    bonus_status_change: {
        event_type: "bonus_status_change",
        user_id: 1,
        status: "success",
        version: "2.1",
        request_id: "123456",
        partner_id: 58,
        cashdesk_id: 13,
        time_stamp: 123456789,
        service: "prewager@de1ef01p",
        data: {
            version: 1,
            type: "PWB",
            status_from: {
                name: "proposed"
            },
            status_to: {
                name: "wagering"
            },
            bonus_state: {
                bonus_id: 1,
                campaign_id: 1,
                user_id: 444,
                status: "wagering",
                currency: "USD",
                bonus_amount: 10,
                wagered_amount: 5.3,
                amount_for_wager: 100.2,
                wagered_percent: 50.4,
                comment: "Test comment",
                activation_expired_at: "2011-08-12T20:17:46.384Z",
                activated_at: "2011-08-12T20:17:46.384Z",
                deactivated_at: "2011-08-12T20:17:46.384Z",
                created_at: "2011-08-12T20:17:46.384Z",
                updated_at: "2011-08-12T20:17:46.384Z"
            }
        }
    }
}

let engine: any = new Engine()

engine.addRule(rule)


engine
    .run(fact)
    .then((result: any) => {
        const {events} = result;
        events.map((event: any) => console.log(event.params.message))
    })
    .catch((error: unknown) => {
        console.error('Error running the engine:', error)
    })

