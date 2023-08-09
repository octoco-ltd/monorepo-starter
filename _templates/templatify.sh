#!/bin/bash

# Check if any file argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <path/to/example.ts> or $0 /path/to/stuff/*.ts"
    exit 1
fi

# Process each input file using the star glob
for file in "$@"; do
    # Check if the file exists
    if [ ! -f "$file" ]; then
        echo "Error: File not found: $file"
        continue
    fi

    # Get the input file path
    input_file_path="$(realpath "$file")"

    # Get the git root directory
    git_root="$(git rev-parse --show-toplevel)"

    # Get the input file path relative to git root
    header_path="$(realpath --relative-to="$git_root" "$input_file_path")"

    # Get the input file name without extension and remove "off-taker" from the name
    file_name="$(basename "${file%.*}")"
    output_file="${file_name/off-taker.}".ejs.t

    # Perform the substitutions and store the result in the output file using awk
    awk -v new_name="<%=h.changeCase.paramCase(name)%>" \
        -v pascal_name="<%=h.changeCase.pascalCase(name)%>" \
        -v camel_name="<%=h.changeCase.camelCase(name)%>" \
        -v snake_name="<%=h.changeCase.snakeCase(name)%>" \
        '{
            gsub("off taker", new_name);
            gsub("OffTaker", pascal_name);
            gsub("offTaker", camel_name);
            gsub("off-taker", new_name);
            gsub("off_taker", snake_name);
        }
        { print }
        ' "$file" > "$output_file"

    header_path=$(echo "$header_path" | \
    awk -v new_name="<%=h.changeCase.paramCase(name)%>" \
        -v pascal_name="<%=h.changeCase.pascalCase(name)%>" \
        -v camel_name="<%=h.changeCase.camelCase(name)%>" \
        -v snake_name="<%=h.changeCase.snakeCase(name)%>" \
        '{
            gsub("off taker", new_name);
            gsub("OffTaker", pascal_name);
            gsub("offTaker", camel_name);
            gsub("off-taker", new_name);
            gsub("off_taker", snake_name);
        }
        { print }
        ')

    # Add the Hygen header to the output file
    header="---\nto: $header_path\n---\n"
    echo -e "$header$(cat "$output_file")" > "$output_file"

    echo "Substitutions completed successfully for $file. The result is saved in $output_file."
done

