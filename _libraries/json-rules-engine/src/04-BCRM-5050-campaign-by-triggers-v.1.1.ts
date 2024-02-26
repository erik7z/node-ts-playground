import {Engine} from 'json-rules-engine';

async function setupEngine(rules: any) {
    let engine = new Engine();

    rules.forEach((rule: any) => {
        engine.addRule(rule);
    });

    return engine;
}

async function checkBonus(message: any) {
    let bonusStatusRule = {
        conditions: {
            all: [
                {
                    fact: 'status_from',
                    operator: 'equal',
                    value: 'proposed'
                },
                {
                    fact: 'status_to',
                    operator: 'equal',
                    value: 'wagering'
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

    const engine = await setupEngine([bonusStatusRule]);

    // Setting up facts based on the received message
    const facts = {
        status_from: message.data.status_from.name,
        status_to: message.data.status_to.name,
    };

    try {
        let {events} = await engine.run(facts);
        if (events.length > 0) {
            console.log(`Bonus ID ${message.data.bonus_state.bonus_id} status changed to ${message.data.status_to.name}`);
            console.log(events.map((event: any) => event.params.message));
        }
    } catch (error) {
        console.error('Error running the engine:', error);
    }
}

// Example message, replace with actual message received from RabbitMQ
const message = {
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
};

// Simulate handling the message
checkBonus(message);
