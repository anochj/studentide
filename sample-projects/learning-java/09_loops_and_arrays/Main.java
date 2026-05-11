public class Main {
    public static void main(String[] args) {
        String[] foods = {"pizza", "sushi", "tacos"};

        System.out.println("Favourite foods:");
        for (String food : foods) {
            System.out.println("- " + food);
        }

        int[] scores = {10, 20, 30};
        int total = 0;

        for (int score : scores) {
            total = total + score;
        }

        System.out.println("Total score: " + total);
    }
}
