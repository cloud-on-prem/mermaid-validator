# Sample Markdown with Mermaid Diagrams

This is a sample markdown file containing multiple Mermaid diagrams for testing.

## Valid Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```

## Valid Sequence Diagram

```mermaid
sequenceDiagram
    participant A
    participant B
    A->>B: Hello
    B-->>A: Hi there!
```

## Invalid Diagram

```mermaid
flowchart TD
    A--B
```

## Valid Pie Chart

```mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

Some regular text here.

## Another Valid Flowchart

```mermaid
flowchart LR
    A --> B --> C
```

That's all the diagrams!
