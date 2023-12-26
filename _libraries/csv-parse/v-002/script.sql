START TRANSACTION;
UPDATE bonus.bns SET output_bet_sum = output_bet_sum + 42.00 WHERE id=8290128;
COMMIT;
