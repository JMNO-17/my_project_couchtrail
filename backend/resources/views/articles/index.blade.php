<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Articles</title>
</head>
<body>
    <div>
        <h1>Article List</h1>

        @foreach ($articles as $article)
            <p>{{ $article->id }} : {{ $article->name }} : {{ $article->email }} </p>
            <a href="{{ route('articles.show', ['id' => $article->id]) }}">Show</a>
        @endforeach

    </div>
</body>
</html>
