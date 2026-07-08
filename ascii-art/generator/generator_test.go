package generator

import (
	"reflect"
	"testing"
)

func TestGeneratePattern(t *testing.T) {
	tests := []struct {
		name     string
		input    rune
		expected []string
		hasError bool
	}{
		{
			name:  "Generate letter A",
			input: 'A',
			expected: []string{
				"  ##  ",
				" #  # ",
				" #  # ",
				" #### ",
				" #  # ",
				" #  # ",
				" #  # ",
				"      ",
			},
			hasError: false,
		},
		{
			name:     "Unsupported character - digit",
			input:    '1',
			expected: []string{},
			hasError: true,
		},
		{
			name:     "Unsupported character - lowercase",
			input:    'a',
			expected: []string{},
			hasError: true,
		},
		{
			name:  "Edge case - letter Z",
			input: 'Z',
			expected: []string{
				" #### ",
				"    # ",
				"   #  ",
				"  #   ",
				" #    ",
				" #    ",
				" #### ",
				"      ",
			},
			hasError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GeneratePattern(tt.input)
			if !tt.hasError && !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("GeneratePattern(%c) = %v, want %v", tt.input, result, tt.expected)
			}
			if tt.hasError && len(result) != 0 {
				t.Errorf("Expected empty slice for unsupported char, got %v", result)
			}
		})
	}
}

func TestGeneratePattern_Height(t *testing.T) {
	for c := 'A'; c <= 'Z'; c++ {
		result := GeneratePattern(c)
		if len(result) != 8 {
			t.Errorf("Letter %c has %d lines, expected 8", c, len(result))
		}
		for i, line := range result {
			if len(line) != 6 {
				t.Errorf("Letter %c line %d has length %d, expected 6", c, i, len(line))
			}
		}
	}
}
