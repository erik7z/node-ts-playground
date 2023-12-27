@REQ_CALC-7895
Feature: As a user, I can calculate the sum of 2 numbers

        #  Addition is great as a verification exercise to get the Cucumber-js infrastructure up and running
  @TEST_CALC-4763 @features/addition.feature
  Scenario: Add two number
    Given the numbers 2 and 3
    When they are added together
    Then should the result be 5
