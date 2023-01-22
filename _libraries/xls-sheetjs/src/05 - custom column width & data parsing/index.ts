import XLSX from 'xlsx'

const data = {
  items: [
    {
      error: {
        error: {
          rID: "ExternalAgentApi_27b2bfb5-8390-43a1-8427-6cbe75b21e74",
          code: "DA_20317",
          text: "Вибачте, під час роботи сервісу сталася помилка. Будь ласка, спробуйте пізніше!",
          type: "CLIENT",
          extID: "RLUGL19RE0P4Q0",
          detail: "Не знайдено одержувача з ID=cwU0ZMCh26-F22nsw3I4PA"
        }
      },
      id: "202f8a44-575a-4cf3-800f-7bd8be715bb8",
      inserted_at: "2022-11-24T08:51:09.547Z",
      partner_id: "cwU0ZMCh26-F22nsw3I4PA",
      parsing_id: "b1339e3d-24b9-485e-ad38-f47c118ab41c",
      receiver_id: 1576,
      service_id: "",
      service_name: "",
      status: "ERROR"
    },
    {
      data: {
        updates: {
          fields: {
            created: [],
            deleted: [],
            updated: [
              {
                serviceID: {
                  newValues: {
                    name_en: "serviceID",
                    group_alias: ""
                  },
                  oldValues: {
                    name_en: ""
                  }
                }
              },
              {
                companyID: {
                  newValues: {
                    name_en: "companyID",
                    group_alias: ""
                  },
                  oldValues: {
                    name_en: ""
                  }
                }
              },
              {
                COMPANY_OKPO: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                FIO: {
                  newValues: {
                    value: "",
                    group_alias: ""
                  },
                  oldValues: {
                    value: "-"
                  }
                }
              },
              {
                ACCOUNT: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                NR: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                DEST: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                DR: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                COMPANY: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                SUM: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              }
            ]
          },
          service: {
            id: 34170,
            mfo: "",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAAH5FsI7AAAABGdBTUEAALGPC/xhBQAAC5pJREFUeAHtnHmMVVcdx+fNrgPYBsd0UDIbA1NF28TE1rCIS0kKNHFJg40V26i0xEirVcc2KUxRAxhrqbXU2hpCSk2VWFFbDK1LkT+sJlqRVJmBYVQoTEsou2wD4+d3fb/Deeeduzzem+FNuTe5Oef89vM96z33vldRUfJr+/btQ0mMVotQT0/PVSRzfApTpkxZLvRAkMJW8ltt652dnRlVFHqlFsLSrPKjgcUooUwm8xIeb6+w3bkK8NYpLSOCVVVVNyvBl3Z0dDzpo5cLjcbYIbFoy9ztC6y6uvrJwcHBgGXQl5JC5bRKF6wVgbQt1Nvbu1oVcDtd80ZwYGCgwVYQgTwhI21l+vv766VoKrNjx45PWXyTlUrAqzh37pyhvVEyiZCKqawCGIhFGUSwk/v5vXv3vjnGpnSSH4gt7wiEcQwDDYy8DB3kL01NTSdEmNF4H7Ru2zgO5w8NDT2VpXUZgzTptTDmT548+UtiTJVo5vkoSXesgL+UpFuM19TUTDlz5kwPtAocbcTRXJExkwmKU7nvFGHp24zy90semRYRRKFO6BgIxoMYw9DuLG1AZIIrq6TFC0qpQTBEL0g5VRqNCNDku4qJ2+12pmMXY9TWNUOPSL1Lhi3s5hk9wSJv041BHxMnDzO8jjK+v24r2XkZ01KWqiP7p4xgiLE2W4gZZjHj+kGb1tDQMH7ixImv2zTN2ziaCJUpqRqrrKxcyWRwgnTF8ePHT8LKWShF1jYmE0Vko2C4C4Pd7B9OibJ7ucaEbwxSzQfkdpT+BS6v2IpA9KLI2DSJTPVMlbMTq9I1bZEJ1L4oXxNmTOSMQUvox+LRKovcaWh1krEvOzJDl1Y2hYQZdLaoqOP4PIYqkCSlm80Ik5Mqjwnbj4Qp2fSzZ8/axTSfIvAGRMCdAS5aFZkjdzKeO9wAgqkLZr+7priCw1l2Zyvbl5lblcg09zkm5Me0PFwpm+NZLFOb4+znBQiSj6Mk94heBDzN5zAvQJ+QTQPh6SBsFhObR34QR2PCFnBH1hR1lWP9Xskm4GuGQSYvQF8Ti4H9+/ePPXDgwBFdn2trazvVEEZrWFPmwVtOepI+VaFOVSYqJbCF2HiUO0eMsbEwGMVJBonbkSUAm6aj0KbFBQkY11OpjTlRUcDWCrpasE2NRTDKicsjOO/ZD4E8hcNPaiAgdjVovaStoXQCE7mbtCxpXoARg+Qo8mNtZRstmy55nMnzb3ARyHxk50MjO5TxNOUW/M5UeTvNC5C9zWwMLLaFUJ4HWuNwsgj6auGByk9cBFSnrq7u8tbW1kNSRsecmElwKpNNe7EbbPQduikm7oNGQy339rZJRUClA8d/ZfR+M2z0wq+mQmcsG8cJbIyW4T1LfjJA+FcSFSwkZRcue907k+hQCTmvc9EzqlRgDjI7DcHKmOcIi1ZWWemDx6hBa1SHH6GIZRCmV4pAikCKQIpAikCJEcjZFZfYdkHm3M2vUb7YazD7gKqoGMp+N1P2AeZt+aPgNv2iBJnQPufYzguQne09jszFLY4UYmG1zA6SHpvPg5s5Yw+mmaRw20Z40LmL8nRu2Qk/zQPPBpufNE+AlbRacKRAXt7emOMFbNYWHCAG/okhc+zhBPI9KnuHQ0tc9LTmtoJGsRiICE4CWUwFvE9ncVF6gpOH/z15g8QVRGgBUD+B41cJLvADbQ5v1uSxM7g4MGriGfkx+JO427HRBZIrlR+Xuj5FHh9D+J2TF6CvP8o3IocOHXqbOpLgODnopTMvFxpBbcZYB5XYQ/7tkFZwJwoQnUF0xEzOhb2gdRM18eHDhx/O0f5/oRLUuuTGgZ5QfV7lQKVV82EpMqfQrXL5NkiJAsTIbNeIr8yrzCalk4/UITj5iqNW5TW1gxNaXhPb/YF+sBCovefV8OQtWM5xBn3xR+qI1LQbx23LOCpZojx8yMtd81WI0vGVF08egZqvUgWC+I/kSTeB4i1Kl5RyJf2nT/Lwr6BcL3m96KfPaZ5ucK8EBTqrSPdBv1x5mhJcXbbSSgrSRPOgfJVz5MiR46opx78Mkp3SwZXmptpUfX19HXzO0it8AniNipjBpjrjxo1rmDBhwn+1bKeJ+mBWecBWjMrTCl9VPt9wmWb3BSdniWHBiY28JgaVZ9S4pBhdCxrruZu0f4LIA8hJJ/ddvfS37ygD/Rmad1Na4gpaIjjodHlazkMQg3PtG8GfqnC22bbBvx7ajUrXlCa8Hxn3xHSN8u0U5Frb2tpeFVrUh12J+qBtWPOMzC/S+QWdowT2Mzq5zoUqYlKQ30TBTDucxk7lNPZlFZCWyVZeSedTbbbzlOHJ0SWWcG/dtWtXDsK0RuQzSc4XF8MTWrTVuADz+mC0uZHnln2AwTRTzHcfxWLKYMvbLNg2gwBZQ9fZxDSfIpAikCKQIpAikCKQIpAikCKQIjD6EZDz9I3ZM4LRX5sia8DRA1AMPcTxQeJXANUWeIMY2F1kDKNWHRxauYEgI7/gTQ6g1ljA4+CnTcuXUgpwVYzE0EPYKCzK/sQjKvhy4OUd/LpBySkeB72hh7eufLmXOc99tqWlRd4vlOSKBVDAo4t73+CUJIIRNkJ9ZuFy5ABkXnwch3JfEhedZU8hFY3tgYUYG82ysojyRmTapEmT8nYiHPzeyluWu6lfB3LyOmcN753u473TyeDVjVQcxrD9kklWOU6+P0sQX8ZVzpsR8W1fxHGC8i/4i4kl7e3tO2zeSOd5ayS/DM75JYMdA7F2DyuAbA3kF1urcVpjOy4kT5Av0tofo7UTv14txL5Plri7iXupj+fQBmKHMK1wM5X4rqOYU8SZ/EhvGnLBa3+6/HXQfs0d+c4jx0hIARvXnjp1ah9x/B4fs/FxQfu1EPM5ZOK+g1GyCp85dF+BOM7yHnxuLIAIVmHwTT4jQoPfR8VmkCp4ywjiXp+8fDnAK+EeH8+m4a+WyvyQ9DMW/YPQ9u/evbs97Af2lmxBWXqc+FlD3DnfhIQZAbjFvKN/SPixAALOWuTkjr2o4MfDwLOVASZq57+ExvgG8rdQMfk0bLnqkr+MPxTYTPndSismxf5HsbmeOxYH8UNcS8Fjme2zpE8igFf0p5oEeZsGSEv/UfNWOpUF6QarXHCW6eBDgHcC4H6OchLwHpTvE1zwxHGsMk8izadPn77aFyVD8m8MyX9bvKQ9Q57a/27pSVZ+I/ocoH1b6TTItzRvp9DFz69sGqB+IO6nv4D2Pnz8Br2xpLa6N0+Maxmqt5KGCscCyM79Oqx7n0TgfQXe/Zb3beTfa5W9WQKST1Kv8jHpHe9hKridCt7G7R0h6Lvgy/+HdKH7Arx76Clm2IsPwH0X/Bew91afT5eGjQ0AdyNp7IJV0m1Mdk6RYeG9dBGhIlFzoFdXiQIeAOWAjz35z6iDpG9ROXryIkDbhPwfoL9D6VEpsr8lxnlsmeSPWxJd3hZOpOkRomIbCGKph1Uq0sH6+vpZrjHAW2SDJ3zAe4RkVxLwiPnP48ePH0f8HykEPPFTUgDFIEEsI/kwd2z3F/mkF5V8HtuNzc3NB20dwLuS8vdtWtI8Nl/mbsTuNY2NjUeT6tlysXMgw1KeJrxzoGXodR69ruQ58jWhsWL9jqQG3QWksp+rEzqLEdPUdvkRtxQTXVRwC8PxEywQ+30K2P4Cd8bHC6Nhsx/eDIB7xZXBVjX8xI0fOwfyt4KX8bXpBNeRr0wl/+GjE1QlE/kChtVd8Kf6ZCzaMSrwNDrdNIRUNPYS+/TEdaQ3xQjvo6Fn0tA7XTn5+0Qa+BnozQDb4fLDyrEAhimWI51GaqSRNgOkDGtz0SDy3f2naZD1hmhl4JlFDVnvf8dY4jnZ2CGcI13mhewwf+dIhlnyRWQkgy8HXymARbZCCmCRAJo5kIm0lS1G6DNfkX7KWr2QbZVbkWr2WPKsO9NlXIplOpH8JfcvL8W6p3VOEUgRSBFIEUgRGH0I/A+xgMNTv3SUbgAAAABJRU5ErkJggg==",
            name: "Р‘РћР™РљР�, РўРћР’",
            okpo: "30993808",
            active: false,
            period: 0,
            account: "",
            subsidy: false,
            synonyms: [
              "30993808",
              "UA493253210000026002060444609"
            ],
            amount_max: 399999.99,
            amount_min: 2.02,
            service_id: 57,
            destination: "",
            kass_symbol: "5",
            payment_ttd: 0,
            receiver_id: 1576,
            account_name: "privat",
            counter_type: "basic",
            name_visible: true,
            support_debt: false,
            use_two_step: false,
            payments_type: "next_day_by_receiver",
            period_active: [
              0,
              0
            ],
            process_delay: 0,
            payments_count: 0,
            create_template: true,
            registry_period: "next_bank_day",
            transfer_method: "get.B2.08",
            show_cash_symbol: false,
            masterpass_enabled: true,
            destination_visible: false,
            consolidation_method: "get.DP.Payment.PA00068",
            destination_editable: false,
            receiver_destination: "{{destination}}",
            registry_item_active: false,
            consolidation_account: "2902915173",
            commission_destination: "Назначение на комиссию",
            template_show_field_id: 0,
            show_mobile_phone_field: false,
            account_accrued_expenses: "0",
            account_commission_accrual: "0",
            destination_driver_rewrite: false,
            transaction_status_conducted: false
          },
          locations: [],
          active_status: "SHOULD_BE_ACTIVATED"
        }
      },
      id: "9e82e0c7-d531-46e7-9847-0d16c86a83ac",
      inserted_at: "2022-11-24T08:51:14.755Z",
      partner_id: "RxLN4vZa_GhV2RQxqyIwsQ",
      parsing_id: "b1339e3d-24b9-485e-ad38-f47c118ab41c",
      receiver_id: 1576,
      service_id: "34170",
      service_name: "Р‘РћР™РљР�, РўРћР’",
      status: "UPDATED"
    },
    {
      data: {
        updates: {
          fields: {
            created: [],
            deleted: [],
            updated: [
              {
                otH2ABlxzzQkZX89LrwqGA_companyID: {
                  newValues: {
                    name_en: "companyID"
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_serviceID: {
                  newValues: {
                    name_en: "serviceID"
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_companyID: {
                  newValues: {
                    name_en: "companyID"
                  },
                  oldValues: {}
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_otH2ABlxzzQkZX89LrwqGA: {
                  newValues: {
                    name_en: "Маріуполь, платні послуги"
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_companyID: {
                  newValues: {
                    name_en: "companyID"
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_serviceID: {
                  newValues: {
                    name_en: "serviceID"
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_ZCc5OiO_Za2D44x1J2xiYQ: {
                  newValues: {
                    name_en: "Волноваха, платні послуги"
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_yYAK1g0Lr2UYpJFnohurgQ: {
                  newValues: {
                    name_en: "Благодійні внески"
                  },
                  oldValues: {}
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_ACCOUNT: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_serviceID: {
                  newValues: {
                    name_en: "serviceID"
                  },
                  oldValues: {}
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_ADDRESS: {
                  newValues: {
                    value: "",
                    name_en: ""
                  },
                  oldValues: {
                    value: "-"
                  }
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_SUM: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_FIO: {
                  newValues: {
                    value: "",
                    name_en: ""
                  },
                  oldValues: {
                    value: "-"
                  }
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_DEST: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_COMPANY: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_COMPANY_OKPO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                otH2ABlxzzQkZX89LrwqGA_COMPANY_OKPO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_ADDRESS: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_SUM: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_FIO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_DEST: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_COMPANY: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_COMPANY_OKPO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_ACCOUNT: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_ADDRESS: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                yYAK1g0Lr2UYpJFnohurgQ_ACCOUNT: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_FIO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_DEST: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_COMPANY: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                ZCc5OiO_Za2D44x1J2xiYQ_SUM: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              }
            ]
          },
          service: {
            id: 12589,
            mfo: "",
            icon: "data:image/png;base64,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",
            name: "РљРќРџ РќРђР РљРћР›РћР“Р†Р§РќР�Р™ Р”Р�РЎРџРђРќРЎР•Р  Рњ.РњРђР Р†РЈРџРћР›Р¬",
            okpo: "",
            active: false,
            period: 0,
            account: "",
            subsidy: false,
            synonyms: [
              "03097856",
              "UA653354290000026001054016019",
              "03097856",
              "UA763354290000026007054015326",
              "03097856",
              "UA243354290000026007054019463"
            ],
            amount_max: 14999,
            amount_min: 3.02,
            service_id: 48,
            destination: "",
            kass_symbol: "",
            payment_ttd: 0,
            receiver_id: 1576,
            account_name: "privat",
            counter_type: "basic",
            name_visible: true,
            support_debt: false,
            use_two_step: false,
            payments_type: "next_day_by_receiver",
            period_active: [
              0,
              0
            ],
            process_delay: 0,
            payments_count: 0,
            create_template: true,
            registry_period: "next_bank_day",
            transfer_method: "get.B2.08",
            show_cash_symbol: false,
            masterpass_enabled: false,
            destination_visible: false,
            consolidation_method: "get.DP.Payment.PA00068",
            destination_editable: false,
            receiver_destination: "{{destination}}",
            registry_item_active: false,
            consolidation_account: "290227895",
            commission_destination: "Назначение на комиссию",
            template_show_field_id: 0,
            show_mobile_phone_field: false,
            account_accrued_expenses: "0",
            account_commission_accrual: "0",
            destination_driver_rewrite: false,
            transaction_status_conducted: false
          },
          locations: [],
          active_status: "SHOULD_BE_ACTIVATED"
        }
      },
      id: "f21b6aa1-51fa-41ea-8dc1-89cc9dad8965",
      inserted_at: "2022-11-24T08:51:15.056Z",
      partner_id: "00UbpdHtwqcl2qRZk4IxnA",
      parsing_id: "b1339e3d-24b9-485e-ad38-f47c118ab41c",
      receiver_id: 1576,
      service_id: "12589",
      service_name: "РљРќРџ РќРђР РљРћР›РћР“Р†Р§РќР�Р™ Р”Р�РЎРџРђРќРЎР•Р  Рњ.РњРђР Р†РЈРџРћР›Р¬",
      status: "UPDATED"
    },
    {
      data: {
        updates: {
          fields: {
            created: [],
            deleted: [],
            updated: [
              {
                Xb28Eh19_Z4V1OCqJs41fQ_serviceID: {
                  newValues: {
                    name_en: "serviceID"
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_NcGMYmRM4lrq13UZmuxeJA: {
                  newValues: {
                    name_en: "За технічне обслуговування"
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_serviceID: {
                  newValues: {
                    name_en: "serviceID"
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_companyID: {
                  newValues: {
                    name_en: "companyID"
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_serviceID: {
                  newValues: {
                    name_en: "serviceID"
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_bqRTyV_S665Kc4i8B2TevA: {
                  newValues: {
                    name_en: "Оплата за товар"
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_Xb28Eh19_Z4V1OCqJs41fQ: {
                  newValues: {
                    name_en: "Поточний ремонт"
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_companyID: {
                  newValues: {
                    name_en: "companyID"
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_companyID: {
                  newValues: {
                    name_en: "companyID"
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_DD: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_COMPANY_OKPO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_NR: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_SUM: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_FIO: {
                  newValues: {
                    value: "",
                    name_en: ""
                  },
                  oldValues: {
                    value: "-"
                  }
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_COMPANY: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_ACCOUNT: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {
                    name_en: "Розрахунковий рахунок"
                  }
                }
              },
              {
                NcGMYmRM4lrq13UZmuxeJA_DEST: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_DD: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_NR: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_SUM: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_FIO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_COMPANY: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_ACCOUNT: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_DEST: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_DD: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_COMPANY_OKPO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                Xb28Eh19_Z4V1OCqJs41fQ_COMPANY_OKPO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_SUM: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_FIO: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_COMPANY: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_ACCOUNT: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_DEST: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              },
              {
                bqRTyV_S665Kc4i8B2TevA_NR: {
                  newValues: {
                    name_en: ""
                  },
                  oldValues: {}
                }
              }
            ]
          },
          service: {
            id: 16412,
            mfo: "",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAAH5FsI7AAAABGdBTUEAALGPC/xhBQAAC5pJREFUeAHtnHmMVVcdx+fNrgPYBsd0UDIbA1NF28TE1rCIS0kKNHFJg40V26i0xEirVcc2KUxRAxhrqbXU2hpCSk2VWFFbDK1LkT+sJlqRVJmBYVQoTEsou2wD4+d3fb/Deeeduzzem+FNuTe5Oef89vM96z33vldRUfJr+/btQ0mMVotQT0/PVSRzfApTpkxZLvRAkMJW8ltt652dnRlVFHqlFsLSrPKjgcUooUwm8xIeb6+w3bkK8NYpLSOCVVVVNyvBl3Z0dDzpo5cLjcbYIbFoy9ztC6y6uvrJwcHBgGXQl5JC5bRKF6wVgbQt1Nvbu1oVcDtd80ZwYGCgwVYQgTwhI21l+vv766VoKrNjx45PWXyTlUrAqzh37pyhvVEyiZCKqawCGIhFGUSwk/v5vXv3vjnGpnSSH4gt7wiEcQwDDYy8DB3kL01NTSdEmNF4H7Ru2zgO5w8NDT2VpXUZgzTptTDmT548+UtiTJVo5vkoSXesgL+UpFuM19TUTDlz5kwPtAocbcTRXJExkwmKU7nvFGHp24zy90semRYRRKFO6BgIxoMYw9DuLG1AZIIrq6TFC0qpQTBEL0g5VRqNCNDku4qJ2+12pmMXY9TWNUOPSL1Lhi3s5hk9wSJv041BHxMnDzO8jjK+v24r2XkZ01KWqiP7p4xgiLE2W4gZZjHj+kGb1tDQMH7ixImv2zTN2ziaCJUpqRqrrKxcyWRwgnTF8ePHT8LKWShF1jYmE0Vko2C4C4Pd7B9OibJ7ucaEbwxSzQfkdpT+BS6v2IpA9KLI2DSJTPVMlbMTq9I1bZEJ1L4oXxNmTOSMQUvox+LRKovcaWh1krEvOzJDl1Y2hYQZdLaoqOP4PIYqkCSlm80Ik5Mqjwnbj4Qp2fSzZ8/axTSfIvAGRMCdAS5aFZkjdzKeO9wAgqkLZr+7priCw1l2Zyvbl5lblcg09zkm5Me0PFwpm+NZLFOb4+znBQiSj6Mk94heBDzN5zAvQJ+QTQPh6SBsFhObR34QR2PCFnBH1hR1lWP9Xskm4GuGQSYvQF8Ti4H9+/ePPXDgwBFdn2trazvVEEZrWFPmwVtOepI+VaFOVSYqJbCF2HiUO0eMsbEwGMVJBonbkSUAm6aj0KbFBQkY11OpjTlRUcDWCrpasE2NRTDKicsjOO/ZD4E8hcNPaiAgdjVovaStoXQCE7mbtCxpXoARg+Qo8mNtZRstmy55nMnzb3ARyHxk50MjO5TxNOUW/M5UeTvNC5C9zWwMLLaFUJ4HWuNwsgj6auGByk9cBFSnrq7u8tbW1kNSRsecmElwKpNNe7EbbPQduikm7oNGQy339rZJRUClA8d/ZfR+M2z0wq+mQmcsG8cJbIyW4T1LfjJA+FcSFSwkZRcue907k+hQCTmvc9EzqlRgDjI7DcHKmOcIi1ZWWemDx6hBa1SHH6GIZRCmV4pAikCKQIpAikCJEcjZFZfYdkHm3M2vUb7YazD7gKqoGMp+N1P2AeZt+aPgNv2iBJnQPufYzguQne09jszFLY4UYmG1zA6SHpvPg5s5Yw+mmaRw20Z40LmL8nRu2Qk/zQPPBpufNE+AlbRacKRAXt7emOMFbNYWHCAG/okhc+zhBPI9KnuHQ0tc9LTmtoJGsRiICE4CWUwFvE9ncVF6gpOH/z15g8QVRGgBUD+B41cJLvADbQ5v1uSxM7g4MGriGfkx+JO427HRBZIrlR+Xuj5FHh9D+J2TF6CvP8o3IocOHXqbOpLgODnopTMvFxpBbcZYB5XYQ/7tkFZwJwoQnUF0xEzOhb2gdRM18eHDhx/O0f5/oRLUuuTGgZ5QfV7lQKVV82EpMqfQrXL5NkiJAsTIbNeIr8yrzCalk4/UITj5iqNW5TW1gxNaXhPb/YF+sBCovefV8OQtWM5xBn3xR+qI1LQbx23LOCpZojx8yMtd81WI0vGVF08egZqvUgWC+I/kSTeB4i1Kl5RyJf2nT/Lwr6BcL3m96KfPaZ5ucK8EBTqrSPdBv1x5mhJcXbbSSgrSRPOgfJVz5MiR46opx78Mkp3SwZXmptpUfX19HXzO0it8AniNipjBpjrjxo1rmDBhwn+1bKeJ+mBWecBWjMrTCl9VPt9wmWb3BSdniWHBiY28JgaVZ9S4pBhdCxrruZu0f4LIA8hJJ/ddvfS37ygD/Rmad1Na4gpaIjjodHlazkMQg3PtG8GfqnC22bbBvx7ajUrXlCa8Hxn3xHSN8u0U5Frb2tpeFVrUh12J+qBtWPOMzC/S+QWdowT2Mzq5zoUqYlKQ30TBTDucxk7lNPZlFZCWyVZeSedTbbbzlOHJ0SWWcG/dtWtXDsK0RuQzSc4XF8MTWrTVuADz+mC0uZHnln2AwTRTzHcfxWLKYMvbLNg2gwBZQ9fZxDSfIpAikCKQIpAikCKQIpAikCKQIjD6EZDz9I3ZM4LRX5sia8DRA1AMPcTxQeJXANUWeIMY2F1kDKNWHRxauYEgI7/gTQ6g1ljA4+CnTcuXUgpwVYzE0EPYKCzK/sQjKvhy4OUd/LpBySkeB72hh7eufLmXOc99tqWlRd4vlOSKBVDAo4t73+CUJIIRNkJ9ZuFy5ABkXnwch3JfEhedZU8hFY3tgYUYG82ysojyRmTapEmT8nYiHPzeyluWu6lfB3LyOmcN753u473TyeDVjVQcxrD9kklWOU6+P0sQX8ZVzpsR8W1fxHGC8i/4i4kl7e3tO2zeSOd5ayS/DM75JYMdA7F2DyuAbA3kF1urcVpjOy4kT5Av0tofo7UTv14txL5Plri7iXupj+fQBmKHMK1wM5X4rqOYU8SZ/EhvGnLBa3+6/HXQfs0d+c4jx0hIARvXnjp1ah9x/B4fs/FxQfu1EPM5ZOK+g1GyCp85dF+BOM7yHnxuLIAIVmHwTT4jQoPfR8VmkCp4ywjiXp+8fDnAK+EeH8+m4a+WyvyQ9DMW/YPQ9u/evbs97Af2lmxBWXqc+FlD3DnfhIQZAbjFvKN/SPixAALOWuTkjr2o4MfDwLOVASZq57+ExvgG8rdQMfk0bLnqkr+MPxTYTPndSismxf5HsbmeOxYH8UNcS8Fjme2zpE8igFf0p5oEeZsGSEv/UfNWOpUF6QarXHCW6eBDgHcC4H6OchLwHpTvE1zwxHGsMk8izadPn77aFyVD8m8MyX9bvKQ9Q57a/27pSVZ+I/ocoH1b6TTItzRvp9DFz69sGqB+IO6nv4D2Pnz8Br2xpLa6N0+Maxmqt5KGCscCyM79Oqx7n0TgfQXe/Zb3beTfa5W9WQKST1Kv8jHpHe9hKridCt7G7R0h6Lvgy/+HdKH7Arx76Clm2IsPwH0X/Bew91afT5eGjQ0AdyNp7IJV0m1Mdk6RYeG9dBGhIlFzoFdXiQIeAOWAjz35z6iDpG9ROXryIkDbhPwfoL9D6VEpsr8lxnlsmeSPWxJd3hZOpOkRomIbCGKph1Uq0sH6+vpZrjHAW2SDJ3zAe4RkVxLwiPnP48ePH0f8HykEPPFTUgDFIEEsI/kwd2z3F/mkF5V8HtuNzc3NB20dwLuS8vdtWtI8Nl/mbsTuNY2NjUeT6tlysXMgw1KeJrxzoGXodR69ruQ58jWhsWL9jqQG3QWksp+rEzqLEdPUdvkRtxQTXVRwC8PxEywQ+30K2P4Cd8bHC6Nhsx/eDIB7xZXBVjX8xI0fOwfyt4KX8bXpBNeRr0wl/+GjE1QlE/kChtVd8Kf6ZCzaMSrwNDrdNIRUNPYS+/TEdaQ3xQjvo6Fn0tA7XTn5+0Qa+BnozQDb4fLDyrEAhimWI51GaqSRNgOkDGtz0SDy3f2naZD1hmhl4JlFDVnvf8dY4jnZ2CGcI13mhewwf+dIhlnyRWQkgy8HXymARbZCCmCRAJo5kIm0lS1G6DNfkX7KWr2QbZVbkWr2WPKsO9NlXIplOpH8JfcvL8W6p3VOEUgRSBFIEUgRGH0I/A+xgMNTv3SUbgAAAABJRU5ErkJggg==",
            name: "РђР’РўРћР¦Р•РќРўР  Р IР’РќР•, РўРћР’",
            okpo: "",
            active: true,
            period: 0,
            account: "",
            subsidy: false,
            synonyms: [
              "43332172",
              "UA473333910000026002054739461",
              "43332172",
              "UA473333910000026002054739461",
              "43332172",
              "UA473333910000026002054739461"
            ],
            amount_max: 14999,
            amount_min: 3.02,
            service_id: 48,
            destination: "",
            kass_symbol: "32",
            payment_ttd: 0,
            receiver_id: 1576,
            account_name: "privat",
            counter_type: "basic",
            name_visible: true,
            support_debt: false,
            use_two_step: false,
            payments_type: "next_day_by_receiver",
            period_active: [
              0,
              0
            ],
            process_delay: 0,
            payments_count: 0,
            create_template: true,
            registry_period: "next_bank_day",
            transfer_method: "get.B2.08",
            show_cash_symbol: false,
            masterpass_enabled: false,
            destination_visible: false,
            consolidation_method: "get.DP.Payment.PA00068",
            destination_editable: false,
            receiver_destination: "{{destination}}",
            registry_item_active: false,
            registry_item_emails: "",
            consolidation_account: "290227895",
            commission_destination: "Назначение на комиссию",
            template_show_field_id: 0,
            show_mobile_phone_field: false,
            account_accrued_expenses: "0",
            account_commission_accrual: "0",
            destination_driver_rewrite: false,
            transaction_status_conducted: false
          },
          locations: [],
          active_status: "OK"
        }
      },
      id: "f7693862-2337-4305-aacc-a6ea9d6e8788",
      inserted_at: "2022-11-24T08:51:15.208Z",
      partner_id: "cIiYs2uzm00ju7D2NoQBJw",
      parsing_id: "b1339e3d-24b9-485e-ad38-f47c118ab41c",
      receiver_id: 1576,
      service_id: "16412",
      service_name: "РђР’РўРћР¦Р•РќРўР  Р IР’РќР•, РўРћР’",
      status: "UPDATED"
    },
    {
      data: {
        updates: {
          fields: {
            created: [],
            deleted: [],
            updated: [
              {
                serviceID: {
                  newValues: {
                    name_en: "serviceID",
                    group_alias: ""
                  },
                  oldValues: {
                    name_en: ""
                  }
                }
              },
              {
                companyID: {
                  newValues: {
                    name_en: "companyID",
                    group_alias: ""
                  },
                  oldValues: {
                    name_en: ""
                  }
                }
              },
              {
                DD: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                ACCOUNT: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                ND: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                SUM: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                FIO: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                DEST: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                COMPANY: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              },
              {
                COMPANY_OKPO: {
                  newValues: {
                    group_alias: ""
                  },
                  oldValues: {}
                }
              }
            ]
          },
          service: {
            id: 37972,
            mfo: "",
            icon: "data:image/png;base64,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",
            name: "KREDIT-EXPERT KREDITNA SPILKA",
            okpo: "36658742",
            active: false,
            period: 0,
            account: "",
            subsidy: false,
            synonyms: [
              "36658742",
              "UA963007110000026502052700334"
            ],
            amount_max: 399999.99,
            amount_min: 2.02,
            service_id: 57,
            destination: "",
            kass_symbol: "5",
            payment_ttd: 0,
            receiver_id: 1576,
            account_name: "privat",
            counter_type: "basic",
            name_visible: true,
            support_debt: false,
            use_two_step: false,
            payments_type: "next_day_by_receiver",
            period_active: [
              0,
              0
            ],
            process_delay: 0,
            payments_count: 0,
            create_template: true,
            registry_period: "next_bank_day",
            transfer_method: "get.B2.08",
            show_cash_symbol: false,
            masterpass_enabled: true,
            destination_visible: false,
            consolidation_method: "get.DP.Payment.PA00068",
            destination_editable: false,
            receiver_destination: "{{destination}}",
            registry_item_active: false,
            consolidation_account: "2902915173",
            commission_destination: "Назначение на комиссию",
            template_show_field_id: 0,
            show_mobile_phone_field: false,
            account_accrued_expenses: "0",
            account_commission_accrual: "0",
            destination_driver_rewrite: false,
            transaction_status_conducted: false
          },
          locations: [],
          active_status: "SHOULD_BE_ACTIVATED"
        }
      },
      id: "cf433419-61be-4834-a697-e806c32ed52d",
      inserted_at: "2022-11-24T08:51:15.270Z",
      partner_id: "WvazpJko7rIJ2Ap4lM751w",
      parsing_id: "b1339e3d-24b9-485e-ad38-f47c118ab41c",
      receiver_id: 1576,
      service_id: "37972",
      service_name: "KREDIT-EXPERT KREDITNA SPILKA",
      status: "UPDATED"
    }
  ],
  count: 5
};


(() => {

  const headersMapping = {
    service_id: 'ID Сервиса',
    service_name: 'Название сервиса',
    status: "Статус",
    duplicates: "Дубликаты",
    error: "Описание ошибки",
    fields_updated: "Изменения",
  }

  const rows: {
    service_id: string,
    service_name: string,
    status: string,
    duplicates: string,
    error: string,
    fields_updated: string
  }[] = []

  rows.push(headersMapping)

  data.items.forEach((item) => {
    rows.push({
      service_id: item.service_id,
      service_name: item.service_name,
      status: item.status,
      duplicates: "",
      error: (item.status === 'ERROR' && item.error ? item.error.error?.code : ""),
      fields_updated: (item.data ? Object.entries(item.data.updates.fields).map(([operation, actions]) => {
        let actionChanges = `#${operation.toUpperCase()}`

        actionChanges += (actions.length) ? ':\n' : ':NO'

        actionChanges += actions.map((field: { [key: string]: { newValues: { [key: string]: string }, old_values: { [key: string]: string } } }) => {

          let newPropertyValues: string = Object.entries(field).map(([fieldName, updates]) => {
              return Object.entries(updates.newValues).map(([propertyName, propertyValue]) => {
                return `${fieldName}.${propertyName}='${propertyValue}'`
              }).join(', ')
            }
          ).join('; ')

          return newPropertyValues
        }).join(';\n')

        return actionChanges
      }).join('\n') : ""),
    })
  })

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: Object.keys(headersMapping), skipHeader: true });

  worksheet['!cols'] = [{wch:10}, {wch:60}, {wch:8}, {wch:60}, {wch:15}, {wch:80},]

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `PRIVAT-12345`);


  XLSX.writeFile(workbook, "files/files-parser_ListServices.xlsx", { compression: true });
})()

