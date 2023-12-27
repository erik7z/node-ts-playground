Feature: Simple API Endpoint
  Scenario: API returns data from PostgreSQL
    Given database is empty
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should not contain data

  Scenario: Add data to the database
    Given database is empty
    When I send a POST request to "/add" with the data: "sample data"
    Then the response status code should be 200
    And the response should contain "sample data"

  Scenario: Add other data to the database
    Given database is empty
    When I send a POST request to "/add" with the data: "other sample data"
    Then the response status code should be 200
    And the response should contain "other sample data"